#include "../../src/Common/Protocols.h"
#include <magic_enum/magic_enum.hpp>
#include <node/node.h>

using namespace v8;
using namespace std;

class Translator {
    Isolate *isolate;

public:
    explicit Translator(Isolate *isolate) : isolate(isolate) {}

    string toCpp(const Local<String> &value) const {
        String::Utf8Value str(isolate, value->ToString(isolate->GetCurrentContext()).ToLocalChecked());
        return string(*str);
    }

    // We don't make this function static to favor polymorphism with the other toCpp functions
    // ReSharper disable once CppMemberFunctionMayBeStatic
    span<const byte> toCpp(const Local<Uint8Array> &buffer) const {
        const size_t byteOffset = buffer->ByteOffset();
        const size_t byteLength = buffer->ByteLength();
        const byte *data = static_cast<const byte *>(buffer->Buffer()->GetBackingStore()->Data()) + byteOffset;

        // data is an intermediary variable between the argument and the result. It doesn't own any memory.
        // So there's no problem with it escaping the function.
        // ReSharper disable once CppDFALocalValueEscapesFunction
        return span(data, byteLength);
    }

    // ReSharper disable once CppMemberFunctionMayBeStatic
    int toCpp(const Local<Int32> &value) const { return value->Value(); }

    Local<String> toJs(const char* str) const {
        return String::NewFromUtf8(isolate, str, NewStringType::kNormal).ToLocalChecked();
    }

    Local<String> toJs(const string &str) const {
        return this->toJs(str.c_str());
        // return String::NewFromUtf8(isolate, str.c_str(), NewStringType::kNormal).ToLocalChecked();
    }

    Local<Int32> toJs(const int value) const { return Local<Int32>::Cast(Int32::New(isolate, value)); }

    Local<Boolean> toJs(const bool value) const { return Local<Boolean>::Cast(Boolean::New(isolate, value)); }

    Local<Uint8Array> toJs(const span<const byte> buffer) const {
        const auto arrayBuffer = ArrayBuffer::New(isolate, buffer.size());
        const auto uint8Array = Uint8Array::New(arrayBuffer, 0, buffer.size());
        ranges::copy(buffer, static_cast<byte *>(arrayBuffer->GetBackingStore()->Data()));
        return uint8Array;
    }

    Local<Array> toJs(const span<int> values) const {
        Local<Array> array = Array::New(isolate, values.size());
        for (size_t i = 0; i < values.size(); i++) {
            array->Set(isolate->GetCurrentContext(), i, toJs(values[i])).Check();
        }
        return array;
    }
};

void deserializeLog(const FunctionCallbackInfo<Value> &args) {
    Isolate *isolate = args.GetIsolate();
    const Translator translator(isolate);

    if (args.Length() < 1 || !args[0]->IsArrayBufferView()) {
        isolate->ThrowException(
                Exception::TypeError(String::NewFromUtf8(isolate, "Expected a Buffer argument").ToLocalChecked()));
        return;
    }

    const span<const byte> buffer = translator.toCpp(args[0].As<Uint8Array>());

    prot::Log log;
    log.deserialize(buffer);

    const int code = toInt(log.getCode());
    const string message = log.getMessage();
    const string timestamp = log.getTimestampStr();

    const Local<Object> jsObject = Object::New(isolate);
    jsObject->Set(isolate->GetCurrentContext(), translator.toJs("code"), translator.toJs(code)).Check();
    jsObject->Set(isolate->GetCurrentContext(), translator.toJs("message"), translator.toJs(message)).Check();
    jsObject->Set(isolate->GetCurrentContext(), translator.toJs("timestamp"), translator.toJs(timestamp)).Check();

    args.GetReturnValue().Set(jsObject);
}

void deserializeMap(const FunctionCallbackInfo<Value>& args) {
    Isolate *isolate = args.GetIsolate();
    const Translator translator(isolate);

    if (args.Length() < 1 || !args[0]->IsArrayBufferView()) {
        isolate->ThrowException(
                Exception::TypeError(String::NewFromUtf8(isolate, "Expected a Buffer argument").ToLocalChecked()));
        return;
    }

    const span<const byte> buffer = translator.toCpp(args[0].As<Uint8Array>());

    prot::Map map;
    map.deserialize(buffer);
    vector<prot::Location> locations = map.getLocations();
    vector<prot::Customer> customers = map.getCustomers();
    vector<prot::Taxi> taxis = map.getTaxis();

    Local<Array> jsLocations = Array::New(isolate, locations.size());
    Local<Array> jsCustomers = Array::New(isolate, customers.size());
    Local<Array> jsTaxis = Array::New(isolate, taxis.size());

    Local<Object> jsMap = Object::New(isolate);

    for (size_t i = 0; i < locations.size(); i++) {
        const Local<Object> jsLocation = Object::New(isolate);
        const Local<Object> jsCoord = Object::New(isolate);

        jsCoord->Set(isolate->GetCurrentContext(), translator.toJs("x"), translator.toJs(locations[i].coord.x)).Check();
        jsCoord->Set(isolate->GetCurrentContext(), translator.toJs("y"), translator.toJs(locations[i].coord.y)).Check();
        jsLocation->Set(isolate->GetCurrentContext(), translator.toJs("coord"), jsCoord).Check();
        jsLocation->Set(isolate->GetCurrentContext(), translator.toJs("id"), translator.toJs(string(1, locations[i].id))).Check();

        jsLocations->Set(isolate->GetCurrentContext(), i, jsLocation);
    }

    for (size_t i = 0; i < customers.size(); i++) {
        const Local<Object> jsCustomer = Object::New(isolate);
        const Local<Object> jsCoord = Object::New(isolate);

        jsCoord->Set(isolate->GetCurrentContext(), translator.toJs("x"), translator.toJs(customers[i].coord.x)).Check();
        jsCoord->Set(isolate->GetCurrentContext(), translator.toJs("y"), translator.toJs(customers[i].coord.y)).Check();
        jsCustomer->Set(isolate->GetCurrentContext(), translator.toJs("coord"), jsCoord).Check();
        jsCustomer->Set(isolate->GetCurrentContext(), translator.toJs("id"), translator.toJs(string(1, customers[i].id))).Check();
        jsCustomer->Set(isolate->GetCurrentContext(), translator.toJs("location"), translator.toJs(string(1, customers[i].destination))).Check();
        jsCustomer->Set(isolate->GetCurrentContext(), translator.toJs("onboard"), translator.toJs(customers[i].onboard)).Check();
        jsCustomer->Set(isolate->GetCurrentContext(), translator.toJs("inQueue"), translator.toJs(customers[i].inQueue)).Check();
        jsCustomer->Set(isolate->GetCurrentContext(), translator.toJs("nextRequest"), translator.toJs(customers[i].nextRequest)).Check();

        jsCustomers->Set(isolate->GetCurrentContext(), i, jsCustomer);
    }

    for (size_t i = 0; i < taxis.size(); i++) {
        const Local<Object> jsTaxi = Object::New(isolate);
        const Local<Object> jsCoord = Object::New(isolate);
        const Local<Object> jsDest = Object::New(isolate);

        jsTaxi->Set(isolate->GetCurrentContext(), translator.toJs("id"), translator.toJs(taxis[i].id)).Check();
        jsCoord->Set(isolate->GetCurrentContext(), translator.toJs("x"), translator.toJs(taxis[i].coord.x)).Check();
        jsCoord->Set(isolate->GetCurrentContext(), translator.toJs("y"), translator.toJs(taxis[i].coord.y)).Check();
        jsTaxi->Set(isolate->GetCurrentContext(), translator.toJs("coord"), jsCoord).Check();
        jsDest->Set(isolate->GetCurrentContext(), translator.toJs("x"), translator.toJs(taxis[i].dest.x)).Check();
        jsDest->Set(isolate->GetCurrentContext(), translator.toJs("y"), translator.toJs(taxis[i].dest.y)).Check();
        jsTaxi->Set(isolate->GetCurrentContext(), translator.toJs("dest"), jsDest).Check();
        jsTaxi->Set(isolate->GetCurrentContext(), translator.toJs("customer"), translator.toJs(string(1, taxis[i].customer))).Check();
        jsTaxi->Set(isolate->GetCurrentContext(), translator.toJs("connected"), translator.toJs(taxis[i].connected)).Check();
        jsTaxi->Set(isolate->GetCurrentContext(), translator.toJs("ready"), translator.toJs(taxis[i].ready)).Check();
        jsTaxi->Set(isolate->GetCurrentContext(), translator.toJs("stopped"), translator.toJs(taxis[i].stopped)).Check();
        jsTaxi->Set(isolate->GetCurrentContext(), translator.toJs("waitTime"), translator.toJs(taxis[i].waitTime)).Check();

        jsTaxis->Set(isolate->GetCurrentContext(), i, jsTaxi);
    }

    jsMap->Set(isolate->GetCurrentContext(), translator.toJs("locations"), jsLocations).Check();
    jsMap->Set(isolate->GetCurrentContext(), translator.toJs("customers"), jsCustomers).Check();
    jsMap->Set(isolate->GetCurrentContext(), translator.toJs("taxis"), jsTaxis).Check();

    args.GetReturnValue().Set(jsMap);
}

void serializeMessage(const FunctionCallbackInfo<Value> &args) {
    Isolate *isolate = args.GetIsolate();
    const Translator translator(isolate);

    if (args.Length() < 1 || !args[0]->IsObject()) {
        isolate->ThrowException(
                Exception::TypeError(String::NewFromUtf8(isolate, "Expected an Object argument").ToLocalChecked()));
        return;
    }

    const Local<Object> jsObject = args[0].As<Object>();

    const int code = translator.toCpp(jsObject->Get(isolate->GetCurrentContext(), translator.toJs("code")).ToLocalChecked().As<Int32>());
    const short taxiId = translator.toCpp(jsObject->Get(isolate->GetCurrentContext(), translator.toJs("taxiId")).ToLocalChecked().As<Int32>());
    const string id = translator.toCpp(jsObject->Get(isolate->GetCurrentContext(), translator.toJs("id")).ToLocalChecked().As<String>());

    const Local<Object> jsCoord = jsObject->Get(isolate->GetCurrentContext(), translator.toJs("coord")).ToLocalChecked().As<Object>();
    const int x = translator.toCpp(jsCoord->Get(isolate->GetCurrentContext(), translator.toJs("x")).ToLocalChecked().As<Int32>());
    const int y = translator.toCpp(jsCoord->Get(isolate->GetCurrentContext(), translator.toJs("y")).ToLocalChecked().As<Int32>());
    const prot::Coordinate coord(x, y);

    const prot::Message message = prot::Message()
                                          .setSubject(static_cast<prot::SUBJ_REQUEST>(code))
                                          .setId(id[0])
                                          .setTaxiId(taxiId)
                                          .setCoord(coord);

    const auto buffer = message.serialize();
    const auto jsBuffer = translator.toJs(buffer);

    args.GetReturnValue().Set(jsBuffer);
}

template<size_t N, typename T>
void getCodes(const FunctionCallbackInfo<Value> &args, array<T, N> codes, const int offset = 0) {
    Isolate *isolate = args.GetIsolate();
    const Translator translator(isolate);
    const Local<Array> array = Array::New(isolate);

    for (size_t i = 0; i < codes.size(); i++) {
        array->Set(isolate->GetCurrentContext(), i, translator.toJs(static_cast<int>(codes[i]) + offset)).Check();
    }

    args.GetReturnValue().Set(array);
}

void getMessageCodes(const FunctionCallbackInfo<Value> &args) {
    getCodes(args, magic_enum::enum_values<code_logs::MESSAGE>());
}

void getWarningCodes(const FunctionCallbackInfo<Value> &args) {
    getCodes(args, magic_enum::enum_values<code_logs::WARNING>(), 100);
}

void getErrorCodes(const FunctionCallbackInfo<Value> &args) {
    getCodes(args, magic_enum::enum_values<code_logs::ERROR>(), 200);
}

void Initialize(const Local<Object> exports) {
    NODE_SET_METHOD(exports, "serializeMessage", serializeMessage);
    NODE_SET_METHOD(exports, "deserializeLog", deserializeLog);
    NODE_SET_METHOD(exports, "deserializeMap", deserializeMap);

    NODE_SET_METHOD(exports, "getMessageCodes", getMessageCodes);
    NODE_SET_METHOD(exports, "getWarningCodes", getWarningCodes);
    NODE_SET_METHOD(exports, "getErrorCodes", getErrorCodes);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
