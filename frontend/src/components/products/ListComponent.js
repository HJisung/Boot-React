import { useEffect, useState } from "react";
import { getList } from "../../api/productsApi";
import useCustomMove from "../../hooks/useCustomMove";
import FetchingModal from "../common/FetchingModal";

import { API_SERVER_HOST } from "../../api/todoApi";
import PageComponent from "../common/PageComponent";

const host = API_SERVER_HOST

const initState = {
    dtoList:[],
    pageNumList:[],
    pageRequestDTO: null,
    prev: false,
    next: false,
    totoalCount: 0,
    prevPage: 0,
    nextPage: 0,
    totalPage: 0,
    current: 0
}

const ListComponent = () => {

    const {page, size, refresh, moveToList, moveToRead} = useCustomMove()

    
    //serverData는 나중에 사용
    const [serverData, setServerData] = useState(initState)

    //for FetchingModal 
    const [fetching, setFetching] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {

      setFetching(true)

      getList({page,size}).then(data => {
        console.log(data)
        setServerData(data)
        setError('')
        setFetching(false)
      }).catch(() => {
        setError('상품 목록을 불러오지 못했습니다. 서버 상태를 확인해 주세요.')
        setFetching(false)
      })

    }, [page,size, refresh])

    return ( 
      <div className="border-2 border-blue-100 mt-10 mr-2 ml-2">
    
        {fetching? <FetchingModal/> :<></>}
        {error && <p className="p-4 text-red-600">{error}</p>}
    
        <div className="flex flex-wrap mx-auto p-6">
    
          {serverData.dtoList.map(product =>
    
          <div
          key= {product.pno} 
          className="w-1/2 p-1 rounded shadow-md border-2"
          onClick={() => moveToRead(product.pno)}
          >  
    
            <div className="flex flex-col  h-full">
              <div className="font-extrabold text-2xl p-2 w-full ">
                {product.pno}
              </div>
              <div className="text-1xl m-1 p-2 w-full flex flex-col">
                
                <div className="w-full overflow-hidden ">
                  {product.uploadFileNames?.[0] ? (
                    <img alt="product" className="m-auto rounded-md w-60"
                      src={`${host}/api/products/view/s_${product.uploadFileNames[0]}`} />
                  ) : (
                    <div className="m-auto flex h-48 w-full max-w-60 items-center justify-center bg-gray-100 text-gray-500">이미지 없음</div>
                  )}
                </div>
    
                <div className="bottom-0 font-extrabold bg-white">
                  <div className="text-center p-1">
                    이름: {product.pname}
                  </div>
                  <div className="text-center p-1">
                    가격: {product.price}
                  </div>
                </div>
    
              </div>
            </div>
          </div>
          )}
        </div>

        <PageComponent serverData={serverData} movePage={moveToList}></PageComponent>

      </div>
    
      );
    
}
 
export default ListComponent;
