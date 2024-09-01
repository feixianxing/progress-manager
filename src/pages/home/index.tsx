import { Layout } from "antd";
import { useState, useCallback } from 'react';
import { FaAnglesLeft } from "react-icons/fa6";
import { cn } from "../../utils/cn";

import Toolbar from "../../components/tool-bar";
import ProgressEditor from "../../components/progress-editor";

const {
  Header,
  Sider,
  Content,
} = Layout;

const HomePage = () => {
  const [showSider, setShowSider] = useState<boolean>(false);

  const closeSider = useCallback(() => {
    setShowSider(!showSider);
  }, [showSider]);

  return (
    <Layout className="w-full h-full">
      <Header className="w-full flex">
        <Toolbar />
      </Header>
      <Layout className="h-full relative">
        {
          showSider 
          && 
          <Sider 
            className="h-full bg-white"
            theme="light"
            width={300}
          >
            未完成
          </Sider>
        }
        <div className={cn(
          `absolute h-16 w-6 flex items-center justify-center cursor-pointer 
          rounded-tr-md rounded-br-md top-1/2 bg-white -translate-y-1/2`,
          showSider ? `left-[300px]` : `left-0`,
          "hidden"
        )}
          onClick={closeSider}
        >
          <FaAnglesLeft className={cn(
            "",
            !showSider ? "rotate-180" : "rotate-0"
          )}/>
        </div>
        <Content className="overflow-auto">
          <ProgressEditor />
        </Content>
      </Layout>
    </Layout>
  );
}
 
export default HomePage;