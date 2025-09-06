# Spark CLI Tool

An interactive command-line tool for managing Spark wallets and performing blockchain operations.

## Installation

```bash
npm install
```

## Usage

Start the CLI tool:

```bash
npm start
```

## Available Commands

| Command | Description |
|---------|-------------|
| `init` | Initialize a new wallet |
| `address` | Show Spark address |
| `mnemonic` | Display mnemonic phrase |
| `mint` | Mint tokens |
| `balance` | Get wallet balance |
| `token balance` | Get token balance (coming soon) |
| `transfer` | Transfer sats (coming soon) |
| `transfer tokens` | Transfer tokens (coming soon) |
| `batch transfer tokens` | Batch transfer tokens (coming soon) |
| `clear wallet` | Clear wallet information |
| `help` | Show help information |
| `exit` | Exit the program |

## Environment Variables

The tool automatically creates a `.env` file to store wallet information:

- `SPARK_MNEMONIC` - Wallet mnemonic phrase
- `SPARK_ADDRESS` - Spark address

**Note**: The `.env` file contains sensitive information and is protected by `.gitignore`.

## Getting Started

1. **Initialize your wallet**:
   ```bash
   spark> init
   ```

2. **Check your address**:
   ```bash
   spark> address
   ```

3. **View your balance**:
   ```bash
   spark> balance
   ```

4. **Get help**:
   ```bash
   spark> help
   ```

## Security Notes

- Your mnemonic phrase is stored locally in the `.env` file
- Never share your mnemonic phrase with anyone
- The `.env` file is automatically excluded from version control
- Always backup your mnemonic phrase in a secure location

## Development

### Project Structure

```
buildonsparkme/
├── spark/
│   └── spark.cli.js    # Main CLI application
├── package.json        # Dependencies and scripts
├── .env               # Environment variables (auto-generated)
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

### Scripts

- `npm start` - Start the CLI tool
- `npm run dev` - Start with file watching
- `yarn cli` - Alternative start command

## Dependencies

- `@buildonspark/spark-sdk` - Spark SDK for wallet operations
- `@buildonspark/issuer-sdk` - Issuer SDK for token operations
- `dotenv` - Environment variable management
- `@types/node` - TypeScript definitions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the help command: `spark> help`
- Review the documentation
- Open an issue on GitHub

---

**Happy Sparking! 🚀**
