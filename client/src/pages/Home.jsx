import Header from "../components/Header";
import Steps from "../components/Steps";

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center pb-8">
      <Header />
      <Steps />
    </div>
  );
}
