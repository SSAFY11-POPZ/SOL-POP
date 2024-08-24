import { useNavigate } from 'react-router-dom'

const UpperBar = () => {
  const navigate = useNavigate()

  return (
    <div className="h-8 p-2.5 rounded-[10px] justify-start items-center gap-3 inline-flex">
      <svg onClick={() => navigate(-1)} width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 13L1 7L7 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
};

export default UpperBar;