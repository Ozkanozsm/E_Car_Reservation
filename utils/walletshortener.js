const walletShortener = (wallet) => {
  return wallet.slice(0, 8) + "..." + wallet.slice(-8);
};
export default walletShortener;