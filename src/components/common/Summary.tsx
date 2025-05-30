import React from "react";
import { FaChevronRight } from "react-icons/fa6";
import "./Summary.scss";
import Image from "next/image";
import { Card } from "react-bootstrap";
import { useRouter } from "next/navigation";

const SummarySection = ({ summaryData }: { summaryData: ({label:string,value:string,image:string,link?:string}|null)[] }) => {
  const router = useRouter();
  return (
    <section className={"summary"}>
      {
        summaryData.map(summary=>{
          if(!summary){
            return <></>
          }
          return (
            <Card className={`internal-card summaryItem`} key={summary.label} onClick={()=>{
              summary.link ? router.push(summary.link): ''
            }}>
            <div className={"iconContainer"}>
              <Image src={summary.image} width={summary.image==="/employers.png"?20:24} height={24} alt="job" />
            </div>
            <div className={"textContainer"}>
              <div className={"value"}>{summary.value}</div>
              <div className={"label"}>{summary.label}</div>
            </div>
            {
              summary.link && <div className={"more"}>
              <FaChevronRight fontSize={16} />
             </div>
            }
            
          </Card>
          )
        })
      }
    </section>
  );
};

export default SummarySection;
