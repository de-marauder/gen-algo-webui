import { MainContainer } from "@/app/components/Container/MainContainer";

import { Run } from "./Run";

const Page = async ({ params }: { params: { runId: string, no: string } }) => {

  return (
    <MainContainer>
      <Run runId={params.runId} no={params.no} />
    </MainContainer>
  )
}

export default Page;