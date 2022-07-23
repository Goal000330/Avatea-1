import React, {useCallback, useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import helper from "../helpers/";
import { useWallet } from "@albs1/use-wallet";
import { ethers } from "ethers";

const menus = [
  {
    label: "Home",
    href: "/",
    icon: "fa-solid fa-home-user",
  },
  {
    label: "My Activity",
    href: "/activity",
    icon: "fa-solid fa-chart-area",
  },
  {
    label: "Vault List",
    href: "/projects",
    icon: "fa-solid fa-diagram-project",
  },
  // {
  //   label: "Settings",
  //   href: "/settings",
  //   icon: "fa-solid fa-gears",
  // },
    {
      label: "Farms",
      href: "/farms",
      icon: "fa-solid fa-farm",
    },

  {
    label: "Inbox",
    href: "/inbox",
    icon: "fa-solid fa-envelope",
  },
  {
    label: "Logout",
    href: "/logout",
    icon: "fa-solid fa-right-from-bracket",
  },
];

const variants = {
    open: { opacity: 1, zIndex: 65 },
    close: { opacity: 0, transitionEnd: { zIndex: -10 }}
}

export default function Sidebar({ menu, setMenu, setTitle }) {

  return (
    <div className="relative h-[100%]">
        <motion.div initial={{ opacity: 0 }} variants={variants} animate={menu ? "open" : "close"} className="overlay fixed w-[100vw] h-[100vh] bg-black/30" />
        <div
            className={
                "fixed w-[100vw] h-[100vh] top-0 left-0 z-[70] lg-xl:rounded-r-2.5xl transition duration-300 lg-xl:translate-x-0 lg-xl:w-50 xl-2xl:w-66.25 " +
                (menu ? "translate-x-0" : "-translate-x-full")
            }
            onClick={() => setMenu(false)}
            >
            <div className="px-3.75 max-w-66.25 bg-white rounded-r-2.5xl h-[100vh] z-1500">
                <div className="flex items-center justify-start px-3.75">
                    <Image src={"/logo.svg"} alt="logo" width={126} height="100%" />
                </div>
                <nav
                    className="relative flex flex-col justify-between"
                    style={{ height: "calc(100% - 105px)" }}
                >
                    <div className="flex flex-col">
                        {menus.map((menu, index) => (
                            <MenuItem
                                href={menu.href}
                                label={menu.label}
                                icon={menu.icon}
                                setTitle={setTitle}
                                key={index}
                            />
                        ))}
                    </div>
                </nav>
            </div>
        </div>
    </div>
  );
}

export const MenuItem = (props) => {
  const router = useRouter();

  return (
    <Link href={props.href}>
      <a
        className={`link flex items-center font-medium text-base rounded-4xl transition p-3.75 hover:cursor-pointer ${
          router.asPath == props.href
            ? "bg-indigo-500 text-white"
            : router.asPath.indexOf(props.href) == 0 && props.href != "/"
            ? "bg-indigo-500 text-white"
            : "bg-white text-black"
        }`}
        onClick={() => props.setTitle(props.label)}
      >
        <i className={props.icon + " mr-2"} />
        {props.label}
      </a>
    </Link>
  );
};
