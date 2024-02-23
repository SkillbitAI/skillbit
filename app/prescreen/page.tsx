const WaitingRoom = () => {
    return (
      <div className="text-white bg-slate-900 text-center flex flex-col justify-center h-screen">
        
        <div className="px-6 pt-24 max-w-7xl mx-auto">
  <div className="flex justify-center items-center gap-20 mt-36">
    <div className="text-center pb-40">
      <h1 className="text-7xl mt-4">Welcome to the Test Waiting Room</h1>
      
      <h2 className="text-lg font-semibold mb-2">Instructions:</h2>
      <p>Please take a moment to read the instructions carefully before proceeding.</p>

      <div className="mt-8 mx-w-50">
        <ol className="text-left mb-8">
          <li className="mb-2">
            <span className="text-white">&#8226;</span> Ensure you have a stable internet connection.
          </li>
          <li className="mb-2">
            <span className="text-white">&#8226;</span> Find a quiet and comfortable place to take the test.
          </li>
          <li className="mb-2">
            <span className="text-white">&#8226;</span> Have any necessary materials, such as a pen and scratch paper, ready.
          </li>
          <li className="mb-2">
            <span className="text-white">&#8226;</span> Do not refresh or navigate away from this page until instructed to do so.
          </li>
        </ol>
      </div>
    </div>
  </div>
</div>

        
        <div className="bg-indigo-600">
          <div className="max-w-7xl mx-auto p-40 ">
            <h1 className="text-6xl">Ready to start the test?</h1>
            <p className="mt-4  ">Click the button below to begin.</p>
            <button className="bg-white bg-opacity-10 px-6 py-3 rounded-lg  mt-12">
              Start Test
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default WaitingRoom;