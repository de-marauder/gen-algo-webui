import { MainContainer } from "@/app/_components/Container/MainContainer";

import { Run } from "./Run";

const Page = async ({ params }: { params: { runId: string } }) => {

  return (
    <MainContainer>
      <Run runId={params.runId} />
    </MainContainer>
  )
}

export default Page;