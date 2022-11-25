import WrongNetworkMessage from "../components/WrongNetworkMessage";
import ConnectWalletButton from "../components/ConnectWalletButton";
import TodoList from "../components/TodoList";
import { useEffect, useState } from "react";
import { loadWeb3 } from "../methods/loadWeb3";
import ContractAbi from "../public/abis/TaskContract.json";

export default function Home() {
  const [isLogin, setIsLogin] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [getTasks, setGetTasks] = useState([]);
  const [response, setResponse] = useState({});
  const [data, setData] = useState("");

  useEffect(() => {
    const connectAccount = async () => {
      const res = await loadWeb3();
      setAccounts(res);
    };
    connectAccount();
  }, []);

  const AddNewTask = async () => {
    const web3 = window.web3;
    const networkID = await web3.eth.net.getId();
    const networkData = ContractAbi.networks[networkID];
    if (networkData) {
      const contract = new web3.eth.Contract(
        ContractAbi.abi,
        networkData.address
      );
      const res = await contract.methods
        .addTask(data, false)
        .send({ from: accounts[0], value: "200000000000000000" });
      setResponse(res);
      setData("")
    }
  };

  const GetAllTask = async () => {
    const web3 = window.web3;
    const networkID = await web3.eth.net.getId();
    const networkData = ContractAbi.networks[networkID];
    if (networkData) {
      const contract = new web3.eth.Contract(
        ContractAbi.abi,
        networkData.address
      );
      const res = await contract.methods.getMyTasks().call();
      setGetTasks(res);
    }
  };
  const DeleteTask = async (id) => {
    console.log(id);
    const web3 = window.web3;
    const networkID = await web3.eth.net.getId();
    const networkData = ContractAbi.networks[networkID];
    if (networkData) {
      const contract = new web3.eth.Contract(
        ContractAbi.abi,
        networkData.address
      );
      const res = await contract.methods
        .deleteTask(id, true)
        .send({ from: accounts[0], value: "200000000000000000" });
      console.log(res);
      setResponse(res);
    }
    GetAllTask();
  };
  useEffect(() => {
    GetAllTask();
  }, [response]);

  return (
    <div className="bg-[#97b5fe] h-screen w-screen flex justify-center py-6">
      {accounts.length === 0 ? (
        <h1 className="text-[3rem] text-white mt-20">
          Please Connect your metamask
        </h1>
      ) : (
        <TodoList
          AddNewTask={AddNewTask}
          setData={setData}
          getTasks={getTasks}
          DeleteTask={DeleteTask}
          data ={data}
        />
      )}
    </div>
  );
}
