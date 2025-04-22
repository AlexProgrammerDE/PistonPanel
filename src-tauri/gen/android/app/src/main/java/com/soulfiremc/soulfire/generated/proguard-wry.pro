# THIS FILE IS AUTO-GENERATED. DO NOT MODIFY!!

# Copyright 2020-2023 Tauri Programme within The Commons Conservancy
# SPDX-License-Identifier: Apache-2.0
# SPDX-License-Identifier: MIT

-keep class com.pistonpanelmc.pistonpanel.* {
  native <methods>;
}

-keep class com.pistonpanelmc.pistonpanel.WryActivity {
  public <init>(...);

  void setWebView(com.pistonpanelmc.pistonpanel.RustWebView);
  java.lang.Class getAppClass(...);
  java.lang.String getVersion();
}

-keep class com.pistonpanelmc.pistonpanel.Ipc {
  public <init>(...);

  @android.webkit.JavascriptInterface public <methods>;
}

-keep class com.pistonpanelmc.pistonpanel.RustWebView {
  public <init>(...);

  void loadUrlMainThread(...);
  void loadHTMLMainThread(...);
  void setAutoPlay(...);
  void setUserAgent(...);
  void evalScript(...);
}

-keep class com.pistonpanelmc.pistonpanel.RustWebChromeClient,com.pistonpanelmc.pistonpanel.RustWebViewClient {
  public <init>(...);
}