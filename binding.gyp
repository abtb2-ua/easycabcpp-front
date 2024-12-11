{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "addons/protocols.cpp", "../src/Common/Protocols.cpp", "../src/Common/Common.cpp", "../src/Common/Logs.cpp"],
      "cflags_cc": [ "-fexceptions", "-std=gnu++23", "-pthread" ],
      "include_dirs": [
        "/usr/include/glib-2.0",
        "/usr/include/glib-2.0/glib",
        "/usr/lib/glib-2.0/include",
        "/usr/lib/x86_64-linux-gnu/glib-2.0/include",
        "/home/ab-flies/universidad/easycabcpp/./src/Common",
        "/usr/include/sysprof-6",
        "/usr/local/include/laserpants/dotenv-0.9.3",
        "/usr/include/uuid",
      ],
     "libraries": [
       "<!(pkg-config --libs rdkafka ncurses uuid)"
     ],

    }
  ]
}