import Header from "../components/Header";
import HomeMiniFlow from "../components/HomeMiniFlow.jsx";
import Steps from "../components/Steps";

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center pb-10">
      <Header />
      <HomeMiniFlow />
      <Steps />
    </div>
  );
}
