//
//  SafariWebExtensionHandler.swift
//  Shared (Extension)
//
//  Created by Maxi Cassola on 30/05/2024.
//

import SafariServices
import WebKit

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {

    var webView: WKWebView?

    func beginRequest(with context: NSExtensionContext) {
        // Configurar el WKWebView
        let webView = WKWebView(frame: .zero)
        webView.configuration.userContentController.add(self, name: "myHandler")
        
        // Cargar una página web si es necesario
        if let url = Bundle.main.url(forResource: "index", withExtension: "html") {
            webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
        }

        self.webView = webView

        // Leer el mensaje de UserDefaults
        let userDefaults = UserDefaults(suiteName: "group.com.ttt246llc.wtm")
        if let message = userDefaults?.string(forKey: "access_token") {
            print("access_token: \(message)")
            // Ejecutar JavaScript para enviar el mensaje al contenido web
            let script = "receiveMessage('\(message)')"
            webView.evaluateJavaScript(script, completionHandler: nil)
        }
    }
}

extension SafariWebExtensionHandler: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "myHandler" {
            if let body = message.body as? String {
                print("Message from Web: \(body)")
            }
        }
    }
}
