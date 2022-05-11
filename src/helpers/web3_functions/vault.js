import {ethers} from 'ethers';
import Vault from '../abi/Vault.json';


const stake = async (wallet, vault, amount, callback) => {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const signer = provider.getSigner();
    const vaultContract = await new ethers.Contract(vault, Vault.abi, signer);

    try {
        const allowanceTx = await vaultContract.stake(amount);
        await allowanceTx.wait();
        console.log('stake success')
    } catch (e) {
        alert(e)
        console.log('stake error', e);
    }
}

const withdraw = async (wallet, vault, amount, callback) => {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const signer = provider.getSigner();
    const vaultContract = await new ethers.Contract(vault, Vault.abi, signer);

    try {
        const allowanceTx = await vaultContract.withdraw(amount);
        await allowanceTx.wait();
        console.log('withdraw success')
    } catch (e) {
        alert(e)
        console.log('withdraw error', e);
    }
}

const getReward = async (wallet, vault, callback) => {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const signer = provider.getSigner();
    const vaultContract = await new ethers.Contract(vault, Vault.abi, signer);

    try {
        const allowanceTx = await vaultContract.getReward();
        await allowanceTx.wait();
        console.log('getReward success')
    } catch (e) {
        alert(e)
        console.log('getReward error', e);
    }
}

const exit = async (wallet, vault, callback) => {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const signer = provider.getSigner();
    const vaultContract = await new ethers.Contract(vault, Vault.abi, signer);

    try {
        const allowanceTx = await vaultContract.exit();
        await allowanceTx.wait();
        console.log('exit success')
    } catch (e) {
        alert(e)
        console.log('exit error', e);
    }
}

const balanceOf = async (wallet, vault, address, callback) => {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const signer = provider.getSigner();
    const vaultContract = await new ethers.Contract(vault, Vault.abi, signer);
    try {
        const result = await vaultContract.balanceOf(address);
        callback(result)
        console.log('balanceOf success')
    } catch (e) {
        alert(e)
        console.log('balanceOf error', e);
    }
}

export {
    stake,
    withdraw,
    balanceOf,
    getReward,
    exit,
}