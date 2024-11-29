import Submit from "../components/Submit";
import Navbar from "../components/Navbar";
import Guide from "../components/Guide";
export default function InputPage() {
  return (
    <>
      <Navbar />
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex flex-col">
          <Submit />
          <Guide />
        </div>
      </div>
    </>
  );
}
