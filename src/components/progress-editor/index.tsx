import { useProgressStore } from "../../stores";
import Progress from "./progress";

const ProgressEditor = () => {
  const { state } = useProgressStore();
  
  return (
    <section className="py-4 px-4 sm:px-12 w-full h-full bg-gray-100 flex flex-col gap-3 max-w-screen-lg mx-auto">
      {
        state.progress.map(p => (
          <Progress progress={p} key={p.id}/>
        ))
      }
    </section>
  );
}
 
export default ProgressEditor;