import axios from "axios";
import { useWallet } from "use-wallet";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import helper from "../../src/helpers";
import { ethers } from "ethers";
import {
  AVATEA_TOKEN_ADDRESS,
  CLOUD_2_TOKEN_ADDRESS,
} from "../../src/helpers/constants";

// core components
import InputEmpty from "../../src/components/core/Input/InputEmpty";
import InputWithIconSubmit from "../../src/components/core/Input/InputWithIconSubmit";
import Button from "../../src/components/core/Button/Button";
import ButtonOutline from "../../src/components/core/Button/ButtonOutline";
import RangeSlider from "../../src/components/core/RangeSlider/RangeSlider";
import Radio from "../../src/components/core/Radio/Radio";
import Tab from "../../src/components/core/Tab/Tab";

// project detail components
import Banner from "../../src/components/pages/projectDetail/Banner/Banner";
import Card from "../../src/components/pages/projectDetail/Card/Card";
import Feed from "../../src/components/pages/projectDetail/Feed/Feed";

const tabItems = ["Vault(News)", "Market Making", "Vesting"];

export default function ProjectDetail({ projectDetail }) {
  //@Todo add min buy limit and max buy limit fields (stop-loss)
  const wallet = useWallet();
  const router = useRouter();
  const { slug } = router.query;
  const [project, setProject] = useState({});
  const [vault, setVault] = useState({});
  const [marketMakingPool, setMarketMakingPool] = useState({});
  const [amountToStake, setAmountToStake] = useState(0);
  const [amountBaseToken, setAmountBaseToken] = useState(0);
  const [amountPairToken, setAmountPairToken] = useState(0);
  const [amountToVaultStake, setAmountToVaultStake] = useState(0);
  const [vaultBalance, setVaultBalance] = useState(0);
  const [marketMakingType, setMarketMakingType] = useState(null);
  const [amountSettings, setAmountSetting] = useState(null);
  const [pressure, setPressure] = useState(null);
  const [priceLimit, setPriceLimit] = useState(null);
  const [fresh, setFresh] = useState(false);
  const [marketMakingSettingsId, setMarketMakingSettingsId] = useState(null);
  const [mode, setMode] = useState(1); // 0 - buy, 1 - hold, 2 - sell
  const [tab, setTab] = useState(0); // 0 - Vault(News), 1 - Market Making, 2 - Vesting

  useEffect(() => {
    if (projectDetail) setProject(projectDetail);
    else {
      const fetchProject = async () => {
        const result = await helper.project.getProject(slug);
        setProject(result?.project);
        setMarketMakingPool(result?.marketMakingPool);
        setVault(result?.vault);
      };
      fetchProject();
    }
  }, []);

  useEffect(() => {
    //@TODO Error handling if empty market making pool or vault
    if (Object.keys(project).length !== 0) {
      const fetchProject = async () => {
        const result = await helper.project.getProject(project.slug);

        setMarketMakingPool(result?.marketMakingPool);
        setVault(result?.vault);
      };
      fetchProject();
    }
  }, [project]);

  useEffect(() => {
    if (wallet.isConnected()) {
      const initWalletConnected = async () => {
        //@TODO Wire Chain ID for production
        const marketMakingSettings =
          await helper.marketMaking.getMarketMakingSettings({
            slug: project.slug,
            user_address: wallet.account,
          });
        if (marketMakingSettings) {
          const {
            market_making_type,
            amount,
            buy_sell_pressure,
            priceLimit,
            id,
          } = marketMakingSettings;
          if (!market_making_type) setFresh(true);
          setMarketMakingSettingsId(id);
          setMarketMakingType(market_making_type);
          setAmountSetting(amount);
          setPressure(buy_sell_pressure);
          setPriceLimit(priceLimit);
        }
        setAmountBaseToken(
          (
            await helper.marketMaker.available(
              wallet,
              marketMakingPool.address,
              wallet.account
            )
          ).toString()
        );
        setAmountPairToken(
          (
            await helper.marketMaker.getWithdrawablePairedTokens(
              wallet,
              marketMakingPool.address,
              wallet.account
            )
          ).toString()
        );
        setVaultBalance(
          (
            await helper.vault.balanceOf(wallet, vault.address, wallet.account)
          ).toString()
        );
      };
      initWalletConnected();
    }
  }, [wallet, marketMakingPool]);

  const stakeMarketMaker = async () => {
    const wei = ethers.utils.parseEther(amountToStake);
    await helper.marketMaker.stake(wallet, marketMakingPool.address, wei);
  };

  const approve = async (address, tokenAddress) => {
    console.log(address);
    const totalSupply = await helper.token.fetchTotalSupply(wallet);
    console.log(totalSupply);
    await helper.token.approveCustomToken(
      wallet,
      address,
      totalSupply,
      tokenAddress
    );
  };

  const withdrawBaseToken = async () => {
    await helper.marketMaker.withdrawBaseToken(
      wallet,
      marketMakingPool.address,
      amountBaseToken
    );
  };

  const withdrawPairToken = async () => {
    await helper.marketMaker.withdrawPairToken(
      wallet,
      marketMakingPool.address,
      amountPairToken
    );
  };

  const stakeVault = async () => {
    console.log(amountToVaultStake);
    const wei = ethers.utils.parseEther(amountToVaultStake);
    await helper.vault.stake(wallet, vault.address, wei);
  };

  const withdrawVault = async () => {
    await helper.vault.withdraw(wallet, vault.address, vaultBalance);
  };

  const updateSettings = async () => {
    console.log(fresh);
    const marketMakingSettings = {
      marketMakingType,
      amountSettings,
      pressure,
      priceLimit,
      marketMakingPoolId: marketMakingPool.id,
      id: marketMakingSettingsId ? marketMakingSettingsId : "",
    };
    await helper.marketMaking.updateMarketMakingSettings({
      marketMakingSettings,
      wallet,
      fresh,
    });
  };

  const handleSetMode = useCallback((mode) => {
    setMode(mode);
  }, []);

  return (
    <div className="space-y-7.5">
      <Banner {...project} />
      {/* Tab menu */}
      <div className="flex justify-center">
        <Tab items={tabItems} tab={tab} setTab={setTab} />
      </div>
      {/* Staked Avatea in vaults & News Feed */}
      {tab == 0 && (
        <div className="grid md-lg:grid-cols-2 gap-7.5">
          <Card>
            <div className="divide-y">
              {/* Card Header */}
              <div className="card-header">
                <h1 className="text-2xl">Staked Avatea in vaults</h1>

                <div className="py-5.5 space-y-4.5">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Transaction</span>
                    <span className="text-base font-medium">2,345.56</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Expected APY</span>
                    <span className="text-base font-medium">1234</span>
                  </div>
                </div>
              </div>

              <div className="card-content pt-5 space-y-3.75">
                <div>
                  <span className="text-base">
                    <i className="fa-regular fa-sack-dollar mr-1"></i> Invest
                  </span>
                  <InputWithIconSubmit
                    id="max"
                    name="max"
                    type="number"
                    value="15"
                    submitName="Approve"
                    icon="fa-solid fa-handshake-simple"
                  />
                </div>
                <div>
                  <span className="text-base">
                    <i className="fa-regular fa-circle-minus mr-1"></i>
                    Withdraw Avatea
                  </span>
                  <InputWithIconSubmit
                    id="withdrawAvatea"
                    name="withdrawAvatea"
                    type="number"
                    value="0"
                    submitName="Withdraw"
                    icon="fa-light fa-circle-minus"
                  />
                </div>
                <div className="grid md-lg:grid-cols-2 gap-3.75">
                  <Button name="Withdraw Rewards" />
                  <Button name="Withdraw Both" />
                </div>
              </div>
            </div>
          </Card>
          <Card title="News Feed">
            {/* Card Header */}
            <div className="card-header">
              <h1 className="text-2xl">News Feed</h1>
            </div>

            <div className="card-content pt-5.5">
              <Feed />
            </div>
          </Card>
        </div>
      )}

      {/* Activity & Settings */}
      {tab == 1 && (
        <div className="grid md-lg:grid-cols-2 gap-7.5">
          <Card title="Activity">
            {/* Card Header */}
            <div className="card-header">
              <h1 className="text-2xl">Activity</h1>

              <div className="py-5.5 space-y-4.5">
                <div className="flex justify-between">
                  <span className="text-sm">Sold</span>
                  <span className="flex text-base font-medium">
                    <img
                      src="/coins/maticIcon.png"
                      className="w-6 h-6 mr-2.5"
                    />
                    100.00
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Bought</span>
                  <span className="flex text-base font-medium">
                    <img
                      src="/coins/maticIcon.png"
                      className="w-6 h-6 mr-2.5"
                    />
                    100.00
                  </span>
                </div>
              </div>
            </div>

            <div className="card-content space-y-5">
              <div className="space-y-3.75">
                <div className="space-y-2.5">
                  <span className="text-base">
                    <i className="fa-regular fa-money-bills-simple mr-1"></i>
                    Cash: 100.000
                  </span>
                  <InputWithIconSubmit
                    id="withdrawCash"
                    name="withdrawCash"
                    type="number"
                    placeholder="Input amount to withdraw"
                    submitName="Withdraw"
                    icon="fa-light fa-circle-minus"
                    setValue={setAmountPairToken}
                    submitFunction={withdrawPairToken}
                  />
                </div>
                <div className="space-y-2.5">
                  <span className="text-base">
                    <i className="fa-regular fa-hexagon-vertical-nft mr-1"></i>
                    Tokens: 100.000
                  </span>
                  <InputWithIconSubmit
                    id="withdrawToken"
                    name="withdrawToken"
                    type="number"
                    placeholder="Input amount to withdraw"
                    submitName="Withdraw"
                    icon="fa-light fa-circle-minus"
                    setValue={setAmountBaseToken}
                    submitFunction={withdrawBaseToken}
                  />
                </div>
              </div>
            </div>
          </Card>
          <Card title="Settings">
            {/* Card Header */}
            <div className="card-header">
              <h1 className="text-2xl">Settings</h1>
            </div>

            <div className="card-content pt-5.5 space-y-5">
              <div className=" grid md-lg:grid-cols-2 gap-5">
                <div className="flex flex-col space-y-10">
                  <span className="text-sm">Pressure Slider</span>
                  <RangeSlider percent="10" />
                </div>
                <div className="space-y-2.5">
                  <span className="text-sm">Estimation</span>
                  <InputEmpty placeholder="7 Days" readOnly />
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="text-sm">Mode</span>
                <div className="grid grid-cols-2 md-lg:grid-cols-3 gap-x-4 gap-y-2.5">
                  <Radio
                    name="mode"
                    label="Buy"
                    value={0}
                    handleSetMode={handleSetMode}
                  />
                  <Radio
                    name="mode"
                    label="Hold"
                    value={1}
                    handleSetMode={handleSetMode}
                  />
                  <Radio
                    name="mode"
                    label="Sell"
                    value={2}
                    handleSetMode={handleSetMode}
                  />
                </div>
              </div>

              <Button name="Save Settings" />

              <div className="card-content pt-1 space-y-3.75">
                {mode == 0 && (
                  <div className="space-y-2.5">
                    <span className="text-base">
                      <i className="fa-regular fa-money-bills-simple mr-1"></i>
                      Cash
                    </span>
                    <InputWithIconSubmit
                      id="cash"
                      name="cash"
                      type="number"
                      value="2324"
                      icon="fa-light fa-circle-plus"
                      submitName="Deposit"
                    />
                  </div>
                )}

                {mode == 2 && (
                  <div className="space-y-2.5">
                    <span className="text-base">
                      <i className="fa-regular fa-hexagon-vertical-nft mr-1"></i>
                      Token
                    </span>
                    <InputWithIconSubmit
                      id="token"
                      name="token"
                      type="number"
                      value="2324"
                      icon="fa-light fa-circle-plus"
                      submitName="Deposit"
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {tab == 2 && (
        <Card>
          <div className="vesting-header">
            <h1 className="text-2xl">Vesting</h1>

            <div className="py-5.5 space-y-4.5">
              <div className="flex justify-between">
                <span className="text-sm">Total Vested</span>
                <span className="flex text-base font-medium">
                  <img src="/coins/maticIcon.png" className="w-6 h-6 mr-2.5" />
                  100.00
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Releasable</span>
                <span className="flex text-base font-medium">
                  <img src="/coins/maticIcon.png" className="w-6 h-6 mr-2.5" />
                  100.00
                </span>
              </div>
            </div>
          </div>

          <div className="grid md-lg:grid-cols-2 gap-3.75">
            <ButtonOutline name="Total Amount(1000.00)" />
            <ButtonOutline name="Amount of Tokens" />
          </div>

          <div className="pt-9">
            <Button name="Release Tokens" />
          </div>
        </Card>
      )}
    </div>
  );
}

// ProjectDetail.getInitialProps = async (ctx) => {
//     console.log(ctx);
//     // const res = await fetch('https://api.github.com/repos/vercel/next.js')
//     // const json = await res.json()
//      return { test: 'test' }
// }

export async function getServerSideProps(context) {
  const { slug } = context.query;
  let projectDetails;
  try {
    projectDetails = await helper.project.getProject(slug);
    console.log(projectDetails);
  } catch (e) {
    console.log(e);
    projectDetails = {};
  }
  return {
    props: {
      projectDetail: projectDetails?.project,
      marketMakingPool: projectDetails?.marketMakingPool,
      vault: projectDetails?.vault,
    },
    // props: {
    //   projectDetail: null,
    //   marketMakingPool: null,
    //   vault: null,
    // },
  };
}
