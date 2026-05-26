import { SVGAttributes } from 'react';


export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <div className="w-[200px]">
            <img src={'/optivesta-white_logo.svg'} alt="" className="block h-20  w-full " />
        </div>
    );
}
