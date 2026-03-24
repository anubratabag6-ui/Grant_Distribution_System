# 🌟 Grant Distribution System

### Soroban Smart Contract on Stellar

A decentralized **Grant Distribution System** built using **Soroban Smart Contracts on the Stellar blockchain**.
This project enables transparent, secure, and automated distribution of grants to approved recipients without relying on centralized intermediaries.

---

# 📌 Project Overview

Grant funding is often managed through centralized systems that lack transparency and are prone to delays or manipulation. This project leverages **blockchain technology** to create a **trustless and transparent grant allocation mechanism**.

Using **Soroban**, Stellar’s smart contract platform, the system ensures that grant allocations are securely stored on-chain and can only be claimed by authorized recipients.

---

# 🚀 Key Features

✅ **Decentralized Grant Allocation**
Grants are managed through a smart contract deployed on the Stellar blockchain.

✅ **Admin-Controlled Distribution**
Only the authorized administrator can assign grant amounts to recipients.

✅ **Secure Claim Mechanism**
Recipients must authenticate their identity before claiming grants.

✅ **Transparent Blockchain Records**
Every grant allocation and claim is recorded immutably on-chain.

✅ **One-Time Claim Protection**
Each grant can only be claimed once to prevent double spending.

✅ **Efficient Soroban Storage Usage**
Optimized storage structure using Soroban’s instance storage.

---

# ⚙️ How It Works

1️⃣ **Contract Initialization**
The smart contract is deployed and initialized with an administrator address.

2️⃣ **Grant Allocation**
The administrator assigns grant amounts to specific recipients.

3️⃣ **On-Chain Storage**
Grant allocations are securely stored within the contract.

4️⃣ **Grant Claiming**
Recipients authenticate and claim their allocated grant.

5️⃣ **Grant Removal**
Once claimed, the grant entry is removed from storage to prevent duplicate claims.

---

# 🧠 Smart Contract Functions

| Function                          | Description                                    |
| --------------------------------- | ---------------------------------------------- |
| `init(admin)`                     | Initializes the contract with an administrator |
| `assign_grant(recipient, amount)` | Admin assigns grant to recipient               |
| `claim_grant(recipient)`          | Recipient claims their grant                   |
| `get_grant(recipient)`            | View assigned grant amount                     |

---

# 🏗️ Tech Stack

* **Stellar Blockchain**
* **Soroban Smart Contracts**
* **Rust Programming Language**
* **Stellar CLI**
* **GitHub**

---

# 📂 Project Structure

```
grant-distribution-system
│
├── contracts
│   └── grant_contract
│       └── src
│           └── lib.rs
│
├── Cargo.toml
├── README.md
└── LICENSE
```

---

# 🔗 Deployed Smart Contract

Testnet Explorer Link:

https://stellar.expert/explorer/testnet/contract/CAQZIAGNCHWXI7XJDPIGTNIWHC2V4TALPKG3DBN4PNQHR7WDW4WSF6RV

---

# 🧪 Example Usage

Assign a grant:

```
assign_grant(recipient_address, 100)
```

Claim a grant:

```
claim_grant(recipient_address)
```

---

# 🔮 Future Improvements

* Multi-admin governance system
* DAO-based voting for grant approval
* Grant application submission system
* Time-based grant expiration
* Web dashboard for tracking grants
* Integration with Stellar wallets

---

# 🏆 Hackathon Value

This project demonstrates:

* Practical use of **Soroban Smart Contracts**
* Real-world **blockchain-based funding systems**
* Secure **on-chain fund distribution**
* Decentralized transparency in financial processes

Such systems can be applied to:

* Government funding programs
* University scholarships
* Startup grants
* NGO funding distribution

---

# 📜 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

Developed by **Anubrata Bag**
B.Tech CSE (Artificial Intelligence)

Building decentralized solutions using **Blockchain & Smart Contracts**.
