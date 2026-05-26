import React from "react";

const Tabs = ({ color, tabButton, tabComponents }) => {
  const [openTab, setOpenTab] = React.useState(1);



  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full">
          <ul
            className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row gap-y-4"
            role="tablist"
          >
           { tabButton.map(tabbtn => {
            const {id, title, link} =  tabbtn
            return (
                <li className="-mb-px mr-2 last:mr-0 flex-auto text-center" key={id}>
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-sm rounded block leading-normal " +
                  (openTab === id
                    ? "border-b-4 border-[#5639D4]"
                    : "border-b-0")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(id);
                }}
                data-toggle="tab"
                href={link}
                role="tablist"
              >

                <span className="text-base mr-1"> </span>  {title}
              </a>
            </li>
            )
            })}
          </ul>
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-sm rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                {
                    tabComponents.map(item => {
                        const {id, linkId, component} = item;
                       return (
                        <div className={openTab === id ? "block" : "hidden"} id={linkId} key={id}>
                       {component}
                      </div>
                       )
                    })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default  Tabs
