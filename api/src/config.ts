const flowAccountErrorMessaage = `

No Flow account configured.

Did you export FLOW_ADDRESS and FLOW_PRIVATE_KEY?

`;

const defaultPort = 3000;
const defaultMigrationPath = "./src/migrations";

export function getConfig() {
  const port = process.env.PORT || defaultPort;

  const accessApi = process.env.FLOW_ACCESS_API;

  const minterAddress = process.env.MINTER_ADDRESS!;
  const minterPrivateKeyHex = process.env.MINTER_PRIVATE_KEY!;

  if (!process.env.MINTER_ADDRESS || !process.env.MINTER_PRIVATE_KEY) {
    throw flowAccountErrorMessaage;
  }

  const minterAccountKeyIndex = process.env.MINTER_ACCOUNT_KEY_INDEX || 0;

  const fungibleTokenAddress = process.env.FUNGIBLE_TOKEN_ADDRESS!;

  const nonFungibleTokenAddress = process.env.NON_FUNGIBLE_TOKEN_ADDRESS!;

  const databaseUrl = process.env.DATABASE_URL!;

  const databaseMigrationPath =
    process.env.MIGRATION_PATH || defaultMigrationPath;

  return {
    port,
    accessApi,
    minterAddress,
    minterPrivateKeyHex,
    minterAccountKeyIndex,
    fungibleTokenAddress,
    nonFungibleTokenAddress,
    databaseUrl,
    databaseMigrationPath,
  };
}
