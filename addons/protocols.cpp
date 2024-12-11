#include <node/node.h>
#include "../../src/Common/Protocols.h"

void Add(const v8::FunctionCallbackInfo<v8::Value>& args) {
    v8::Isolate* isolate = args.GetIsolate();
    int value = args[0]->Int32Value(isolate->GetCurrentContext()).ToChecked();
    int value2 = args[1]->Int32Value(isolate->GetCurrentContext()).ToChecked();
    int sum = value + value2;

    args.GetReturnValue().Set(v8::Number::New(isolate, sum));
}

void deserializeLog(const v8::FunctionCallbackInfo<v8::Value>& args) {
    v8::Isolate* isolate = args.GetIsolate();
    auto val = args[0]->ToString(isolate->GetCurrentContext()).ToLocalChecked();
    v8::String::Utf8Value str(isolate, val);
    std::string cppStr(*str);

    // cppkafka::Buffer buffer(cppStr.data(), cppStr.size());
    prot::Log log;
    log.setMessage("Hola");
    // log.deserialize(buffer);
    string message = log.getMessage();

    args.GetReturnValue().Set(v8::String::NewFromUtf8(isolate, message.c_str()).ToLocalChecked());
}

void Initialize(v8::Local<v8::Object> exports) {
    NODE_SET_METHOD(exports, "add", Add);
    NODE_SET_METHOD(exports, "deserializeLog", deserializeLog);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)