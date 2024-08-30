import { useNavigate } from 'react-router-dom';

const UpperBar = ({ title = null }) => {
  const navigate = useNavigate();

  return (
    <div className="mt-2 inline-flex h-8 items-center gap-4 rounded-[10px] p-4">
      <svg
        onClick={() => navigate(-1)}
        width="8"
        height="14"
        viewBox="0 0 8 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 13L1 7L7 1"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {title && <div className="font-bold">{title}</div>}
    </div>
  );
};

export default UpperBar;
