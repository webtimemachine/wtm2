import SafariServices
import os.log

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {

    func beginRequest(with context: NSExtensionContext) {
        let request = context.inputItems.first as? NSExtensionItem

        // Use a custom key for the profile UUID
        let profileKey = "customProfileKey"
        let profile: UUID? = request?.userInfo?[profileKey] as? UUID

        // Use a custom key for the message
        let messageKey = "customMessageKey"
        let message: Any? = request?.userInfo?[messageKey]

        os_log(.default, "Received message from browser.runtime.sendNativeMessage: %@ (profile: %@)", String(describing: message), profile?.uuidString ?? "none")

        let response = NSExtensionItem()
        // Use the same custom key for the response
        response.userInfo = [ messageKey: [ "echo": message ] ]

        context.completeRequest(returningItems: [ response ], completionHandler: nil)
    }
}
