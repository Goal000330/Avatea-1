/* eslint-disable @next/next/no-img-element */
import React, {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {motion} from "framer-motion"

// core components
import Spinner from "../../../core/Spinner";
import {useWallet} from "@albs1/use-wallet";

export default function CardItem(props) {
    const wallet = useWallet();
    const socials = Object.entries(
        Object.fromEntries(
            Object.entries(props).filter(([key]) => key.includes("social_"))
        )
    );

    const checkAdmin = (address) => {
        return props?.admin.includes(address)
    }

    const mapSocials = () => {
        return socials.map((social) => {
            if (social[1]) {
                return (
                    <a
                        key={social[0]}
                        href={social[1]}
                        target={"_blank"}
                        rel={"noReferrer"}
                    >
                        <div className="w-10 h-10 bg-indigo-500 hover:bg-indigo-500/80 rounded-full px-3 py-3 flex items-center justify-center transition">
                            <i
                                className={`text-white text-base fa-brands fa-${social[0].replace(
                                    "social_",
                                    ""
                                )}`}
                            />
                        </div>
                    </a>
                );
            }
        });
    };

    return (
        <div className="relative rounded-2.5xl bg-white overflow-hidden transition hover:shadow-[0_5px_10px_rgba(0,0,0,0.2)]">
            <CardImage image={props.banner} id={props.slug}/>
            <div className="absolute flex items-center justify-center top-2 right-2 gap-2">
                {(wallet.status === "connected" && props?.admin && checkAdmin(wallet.account)) &&
                    <Link href={`management/${props.slug}`}>
                        <div className="flex items-center justify-center w-10 h-10 bg-white/30 rounded-xl hover:cursor-pointer">
                            <motion.span className="w-5 h-5" whileHover={{rotate: 90}}>
                                <i className="fa-regular fa-gear text-white text-xl"/>
                            </motion.span>
                        </div>
                    </Link>
                }
                <div className="flex items-center justify-center w-10 h-10 bg-white/30 rounded-xl">
                    <Image src="https://avatea-bucket.s3.amazonaws.com/media/images/Binance-coin-bnb-logo_s1xsqhX.png" alt="networkImage" width={20} height={20}
                           objectFit="contain"/>
                </div>
            </div>
            <div className="relative py-7.5 px-5">
                <div className="absolute -top-9 p-2 flex items-center justify-center w-14 h-14 bg-white shadow-[0_4px_8px_rgba(0,0,0,0.08)] rounded-0.5xl">
                    <Image src={props.image} alt={props.slug} width={40} height={40}/>
                </div>
                <div className="overflow-hidden text-ellipsis font-medium text-base">
                    {props.name}
                </div>
                <div className="flex items-center justify-center space-x-1 my-3.5">
                    {mapSocials()}
                </div>
                {
                    props.disableDetails ? "" : <>

                        <div className="flex items-center justify-between mb-2.5">
                            <div className="text-sm text-black/60">Whitepaper :</div>
                            <div className="font-semibold text-sm text-right text-indigo-500">
                                <a href={props.whitepaper} target={"_blank"} rel={"noReferrer"}>
                                    View
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mb-2.5">
                            <div className="text-sm text-black/60">Website :</div>
                            <div className="font-semibold text-sm text-right text-black">
                                <a href={props.website} target={"_blank"} rel={"noReferrer"}>
                                    View
                                </a>
                            </div>
                        </div>
                    </>
                }
                {
                    props.management ? <Link href={`/management/${props.slug}`}>
                        <a className="block py-2.5 mt-5 w-full bg-indigo-500 text-white text-center rounded-full hover:bg-indigo-500/80 transition">
                            Manage Project
                        </a>
                    </Link> : <Link href={`/projects/${props.slug}`}>
                        <a className="block py-2.5 mt-5 w-full bg-indigo-500 text-white text-center rounded-full hover:bg-indigo-500/80 transition">
                            View Project
                        </a>
                    </Link>
                }
            </div>
        </div>
    );
}

export const CardImage = (props) => {
    const [imgLoaded, setImgLoaded] = useState(false);

    const handleImageLoad = (event) => {
        const target = event.target;
        if (target.complete) {
            setTimeout(() => setImgLoaded(true), 500);
        }
    };

    return (
        <div className={`relative flex flex-col w-full justify-center bg-white`}>
            {!imgLoaded && (
                <div className="absolute flex w-full justify-center"><Spinner size={5}/></div>
            )}
            <Image
                src={props.image}
                alt={props.slug}
                onLoad={handleImageLoad}
                className={`w-full ${!imgLoaded && 'opacity-0'}`}
                layout="responsive"
                width="100%"
                height={50}
            />
        </div>
    );
};