//
//  ContactsViewController.swift
//  wtm
//
//  Created by Ivan Gomez on 08/07/2024.
//

import UIKit
import Contacts

@available(iOS 17.0, *)
class ContactsViewController: UIViewController {
    
    private let store = CNContactStore()
    private var contacts = [CNContact]() {
        didSet {
            DispatchQueue.main.async {
                self.tableView.reloadData()
            }
        }
    }
    private let keysToFetch = [
        CNContactGivenNameKey,
        CNContactFamilyNameKey,
        CNContactEmailAddressesKey,
        CNContactPhoneNumbersKey
    ] as [CNKeyDescriptor]
    private var tableView = UITableView()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }
    
    override func updateContentUnavailableConfiguration(using state: UIContentUnavailableConfigurationState) {
            contentUnavailableConfiguration = nil
      
        switch CNContactStore.authorizationStatus(for: .contacts) {
        case .authorized:
            fetchContacts()
        case .notDetermined:
            contentUnavailableConfiguration = getEmptyConfig()
        case .denied, .restricted:
            contentUnavailableConfiguration = getDeniedConfig()
        @unknown default:
            break
        }
    }
    
    private func setupUI() {
        view.backgroundColor = .white
        view.addSubview(tableView)
        tableView.register(ContactCell.self,
                           forCellReuseIdentifier: "ContactCell")
        tableView.delegate = self
        tableView.dataSource = self
        setupConstraints()
    }
    
    private func setupConstraints() {
        tableView.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            tableView.topAnchor.constraint(equalTo: view.topAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor)
        ])
}
    
    private func fetchContacts() {
        let request = CNContactFetchRequest(keysToFetch: keysToFetch)
        
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                var fetchedContacts: [CNContact] = []
                try self.store.enumerateContacts(with: request) { contact, _ in
                    fetchedContacts.append(contact)
                }
                self.contacts = fetchedContacts
            } catch {
                print("Error fetching contacts: \(error)")
            }
        }
    }
    
    private func didTapOnSync() {
        self.store.requestAccess(for: .contacts) { _, _ in
            DispatchQueue.main.async {
                self.setNeedsUpdateContentUnavailableConfiguration()
            }
        }
    }
    
    private func getEmptyConfig() -> UIContentUnavailableConfiguration {
        var config = UIContentUnavailableConfiguration.empty()
        config.image = UIImage(systemName: "exclamationmark.circle.fill")
        config.text = "No contacts have been synced yet."
        
        var buttonConfig = UIButton.Configuration.borderless()
        buttonConfig.title = "Sync Contacts"
        buttonConfig.image = UIImage(systemName: "arrow.clockwise.circle.fill")
        config.button = buttonConfig
        
        config.buttonProperties.primaryAction = UIAction.init(handler: { _ in self.didTapOnSync()})
        return config
    }
    
    private func getDeniedConfig() -> UIContentUnavailableConfiguration {
        var config = UIContentUnavailableConfiguration.empty()
        config.image = UIImage(systemName: "x.circle.fill")
        config.text = "Permission denied"
        config.secondaryText = "Allow access to contacts"
        
        return config
    }
}

@available(iOS 17.0, *)
extension ContactsViewController: UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        contacts.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: "ContactCell", for: indexPath) as? ContactCell else {
            return UITableViewCell()
        }
        
        cell.configure(contact: contacts[indexPath.row])
        return cell
    }
}
