
import { MainContainer } from "@/app/_components/Container/MainContainer";
import { Config } from "./config";

const Page = ({ params: { configId } }: { params: { configId: string } }) => {
  return (
    <>
      <MainContainer >
        <Config configId={configId} />
      </MainContainer >
    </>
  )
}

export default Page;
