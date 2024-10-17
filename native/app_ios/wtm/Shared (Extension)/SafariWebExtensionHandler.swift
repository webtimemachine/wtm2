//
//  SafariWebExtensionHandler.swift
//  Shared (Extension)
//
//  Created by Juan Ignacio Martel Sanchez on 9/8/24.
//

import SafariServices
import os.log

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {
    func beginRequest(with context: NSExtensionContext) {
        guard let item = context.inputItems.first as? NSExtensionItem,
              let userInfo = item.userInfo as? [String: Any],
              let message = userInfo[SFExtensionMessageKey] else {
            context.completeRequest(returningItems: nil, completionHandler: nil)
            return
        }
        

        if (((message as? [String: Any])!["isLogin"] != nil) == false) {
            let sharedDefaults = UserDefaults(suiteName: "group.com.ttt246llc.wtm")
            sharedDefaults?.removeObject(forKey: "messageFromExtension")
            sharedDefaults?.synchronize()
        } else {
            let sharedDefaults = UserDefaults(suiteName: "group.com.ttt246llc.wtm")
            sharedDefaults?.set(message, forKey: "messageFromExtension")
            sharedDefaults?.synchronize()
        }
        

        let response = NSExtensionItem()
        response.userInfo = [ SFExtensionMessageKey: [ "Response to": message ] ]
            
        context.completeRequest(returningItems: [response], completionHandler: nil)
    }

}
