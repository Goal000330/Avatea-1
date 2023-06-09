import * as React from "react";
import CenteredContent from "../../core/CenteredContent";
import Image from "next/image";
import Button from "../../core/Button/Button";
import {useRouter} from "next/router";
import ConnectYourWallet from "../../core/ConnectYourWallet";


export default function ManagementAuthentication({ project, wallet, children }) {
    const router = useRouter();

    const checkAdmin = (address) => {
        return project?.admin.includes(address)
    }

    return (
        <div>

            {
                wallet.status === "connected" && project?.admin ? (
                    checkAdmin(wallet.account) ? (
                        children
                    ) :  <CenteredContent>
                        <span className={'text-2xl'}>Unauthorized to manage {project.name}</span>
                        <div className={'w-[70%] mx-auto'}>
                            <Image src={'/unauthorized.png'} layout={'responsive'}  height={679} width={838}/>
                        </div>
                        <Button handleClick={() => router.push('/')}>Return to projects</Button>
                    </CenteredContent>
                ) : <ConnectYourWallet/>
            }


        </div>
    );
}
