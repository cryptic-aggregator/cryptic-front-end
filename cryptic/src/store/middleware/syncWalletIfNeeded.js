export const syncWalletIfNeeded = (id, wallet, existingWallets) => async (dispatch, getState) => {
  if (!id || !wallet?.address) return;

  const key = `${id}_${wallet.address}`;
  
  const isWalletAlreadyConnected = existingWallets.some(
    w => w.wallet_address === wallet.address
  );

  if (isWalletAlreadyConnected) {
    // Тут можна перевірити, чи не показували це повідомлення раніше (через локальний ref або в стані)
    toast.error('Цей гаманець уже приєднаний до поточного портфоліо.');
    return;
  }

  // Якщо ні — диспатчимо асинхронну дію підключення гаманця
  await dispatch(connectWalletToPortfolio({ id, wallet }));
};
