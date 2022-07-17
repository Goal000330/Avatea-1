import {useCallback, useEffect, useState} from "react";
import Image from "next/image";
import {useWallet} from "use-wallet";
import {useRouter} from "next/router";

import helper from "../../../helpers";

// core components
import Button from "../../core/Button/Button";
import InputWithIcon from "../../core/Input/InputWithIcon";
import Modal from "../../core/modal/Modal";

// page components
import Card from "../projectDetail/Card/Card";
import MarketMakingDeployment from "./MarketMakingDeployment";

export default function MarketMakingCard({project, marketMakingPool}) {

    const wallet = useWallet();
    const router = useRouter();
    const [baseTokenBalance, setBaseTokenBalance] = useState("0");
    const [pairedTokenBalance, setPairedTokenBalance] = useState("0");
    const [maxBuyingAmount, setMaxBuyingAmount] = useState("0");
    const [maxSellingAmount, setMaxSellingAmount] = useState("0");
    const [volume, setVolume] = useState("0");
    const [maxPreferredDrawdown, setMaxPreferredDrawdown] = useState("0");
    const [lowerPreferredPriceRange, setLowerPreferredPriceRange] = useState("0");
    const [upperPreferredPriceRange, setUpperPreferredPriceRange] = useState("0");
    const [createMMPool, setCreateMMPool] = useState(false);

    useEffect(() => {
        if (wallet.status === "connected" && marketMakingPool?.address) {
            const initWalletConnected = async () => {
                setBaseTokenBalance(
                    helper.formatting.web3Format(
                        await helper.token.balanceOf(
                            wallet,
                            project.token,
                            marketMakingPool.address
                        ) || '0'
                    )
                );
                setPairedTokenBalance(
                    helper.formatting.web3Format(
                        await helper.token.balanceOf(
                            wallet,
                            marketMakingPool.paired_token,
                            marketMakingPool.address
                        ) || '0'
                    )
                );
            };
            initWalletConnected();
        }
    }, [wallet, marketMakingPool, project]);

    const updateMarketMakingPool = useCallback(async () => {
        const settings = {
            volume,
            max_selling_amount: maxSellingAmount,
            max_buying_amount: maxBuyingAmount,
            max_preferred_drawdown: maxPreferredDrawdown,
            lower_preferred_price_range: lowerPreferredPriceRange,
            upper_preferred_price_range: upperPreferredPriceRange,
            id: marketMakingPool.id,
        };

        await helper.marketMaking.updateMarketMakingPool({
            settings,
            wallet,
        });
    }, [volume, maxBuyingAmount, maxSellingAmount, maxPreferredDrawdown, lowerPreferredPriceRange, upperPreferredPriceRange, marketMakingPool, wallet]);


    useEffect(() => {
        setMaxSellingAmount(marketMakingPool?.max_selling_amount);
        setMaxBuyingAmount(marketMakingPool?.max_buying_amount);
        setVolume(marketMakingPool?.volume);
        setMaxPreferredDrawdown(marketMakingPool?.max_preferred_drawdown);
        setLowerPreferredPriceRange(marketMakingPool?.lower_preferred_price_range);
        setUpperPreferredPriceRange(marketMakingPool?.upper_preferred_price_range);
    }, [marketMakingPool]);


    return (

        <Card className={'col-span-full md:col-span-1'}>
            <Modal
                title="Create a Market Making pool"
                size="sm"
                open={createMMPool}
                handleClose={() => setCreateMMPool(false)}
            >
                <MarketMakingDeployment project={project}/>
            </Modal>
            {marketMakingPool?.address ? (
                <div className="flex flex-col p-3.75 space-y-4">
                    <h2 className="text-2xl"><i className="fa-solid fa-sliders"/> Market Making Pool</h2>
                    <div className="flex justify-between">
                        <span className="text-sm"><i className="fa-solid fa-users"/> Users Staked</span>
                        <span className="text-base font-medium">
                      {marketMakingPool.num_invested}
                    </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm"><i className="fa-solid fa-users"/> Users Vested</span>
                        <span className="text-base font-medium">
                      {marketMakingPool.num_vested}
                    </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">
                        <i className="fa-solid fa-money-bill-transfer"/> TVL
                      </span>
                      <span className="flex text-base font-medium">
                        <Image src={project.image} alt="" width={24} height={24}/>
                        <span className="mx-2.5">{baseTokenBalance}</span>
                        <Image src={marketMakingPool.paired_token_image} alt="" width={24} height={24}/>
                        <span className="mx-2.5">{pairedTokenBalance}</span>
                      </span>
                    </div>
                    <div className="w-full py-2 grid md-lg:grid-cols-2 gap-3.75">
                        <div className="w-full space-y-2.5">
                        <span className="text-base">
                          Max Buying Amount per day
                        </span>
                            <InputWithIcon
                                id="editMaxBuyingAmount"
                                name="editMaxBuyingAmount"
                                type="number"
                                value={maxBuyingAmount}
                                setValue={setMaxBuyingAmount}
                                image={marketMakingPool.paired_token_image}
                            />
                        </div>
                        <div className="w-full space-y-2.5">
                        <span className="text-base">
                          Max Selling Amount per day
                        </span>
                            <InputWithIcon
                                id="editMaxSellingAmount"
                                name="editMaxSellingAmount"
                                type="number"
                                value={maxSellingAmount}
                                setValue={setMaxSellingAmount}
                                image={project.image}
                            />
                        </div>
                    </div>
                    <div className="w-full py-2 grid md-lg:grid-cols-2 gap-3.75">
                        <div className="w-full space-y-2.5">
                            <span className="text-base">Max Preferred Drawdown</span>
                            <InputWithIcon
                                id="editPairToken"
                                name="editPairToken"
                                type="number"
                                value={maxPreferredDrawdown}
                                setValue={setMaxPreferredDrawdown}
                                image={marketMakingPool.paired_token_image}
                            />
                        </div>
                        <div className="w-full space-y-2.5">
                            <span className="text-base">Volume</span>
                            <InputWithIcon
                                id="editPairToken"
                                name="editPairToken"
                                type="number"
                                value={volume}
                                setValue={setVolume}
                                image={project.image}
                            />
                        </div>
                    </div>
                    <div className="w-full py-2 grid md-lg:grid-cols-2 gap-3.75">
                        <div className="w-full space-y-2.5">
                        <span className="text-base">
                          Lower Preferred Price Range
                        </span>
                            <InputWithIcon
                                id="editMaxBuyingAmount"
                                name="editMaxBuyingAmount"
                                type="number"
                                value={lowerPreferredPriceRange}
                                setValue={setLowerPreferredPriceRange}
                                image={marketMakingPool.paired_token_image}
                            />
                        </div>
                        <div className="w-full space-y-2.5">
                        <span className="text-base">
                                Upper Preferred Price Range
                        </span>
                            <InputWithIcon
                                id="editMaxBuyingAmount"
                                name="editMaxBuyingAmount"
                                type="number"
                                value={upperPreferredPriceRange}
                                setValue={setUpperPreferredPriceRange}
                                image={marketMakingPool.paired_token_image}
                            />
                        </div>
                    </div>
                    <Button
                        name="Update Market Making Pool Settings"
                        handleClick={updateMarketMakingPool}
                    />
                    {/* Edit Button */}
                    <Button name="Stake for participants" handleClick={(e) => {
                            router.push(`${project.slug}/multisend`)
                        }}/>
                    <div className="w-full grid grid-cols-2 gap-3.75">
                        {/* Edit Button */}
                        <Button name="Create Vesting schedules" handleClick={(e) => {
                            router.push(`${project.slug}/vesting/add`)
                        }}/>
                        <Button name="View Vesting schedules" handleClick={(e) => {
                            router.push(`${project.slug}/vesting`)
                        }}/>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col p-3.75 space-y-4">
                    <h1 className="text-2xl"><i className="fa-solid fa-sliders"/> Settings</h1>
                    <div className="bg-gray-200 border border-gray-400 px-4 py-3 rounded relative text-center"
                         role="alert">
                        <span>No market making pool created yet</span>

                    </div>
                    <Button
                        name="Create Market Making Pool"
                        handleClick={() => setCreateMMPool(true)}
                    />
                </div>
            )}
        </Card>

    )
}