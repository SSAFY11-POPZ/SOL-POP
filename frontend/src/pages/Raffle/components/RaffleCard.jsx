import PropTypes from 'prop-types'
import {useNavigate} from 'react-router-dom'
import RaffleTest from "../../../assets/RaffleImg/RaffleTest.png"

const RaffleCard = ({raffle}) => {
  const navigate = useNavigate()
  // props 
  RaffleCard.propTypes = {
  raffle: PropTypes.shape({
    raffleId: PropTypes.number.isRequired,
    raffleThumbnailUrl: PropTypes.string.isRequired,
    raffleName: PropTypes.string.isRequired,
    rafflePrice: PropTypes.number.isRequired,
    raffleNumWinners: PropTypes.number.isRequired,
  }).isRequired,
  };

  console.log(raffle)

  return (
    <div className="my-4" onClick={() =>navigate(`/raffle/${raffle.raffleId}`)}>
      <img
        className="aspect-[1/1] w-full"
        // 이부분만 코드 수정하기
        src={raffle.raffleThumbnailUrl.includes("http://example.com/raffle") ? RaffleTest:null}
        alt="raffle thumbnail"
      >
      </img>
      <div className="mx-3 text-2xl font-bold">
        <p className="text-lg text-slate-800 my-1">{raffle.raffleName}</p>
        <div className="flex justify-between my-1">
          <p className="font-bold">{`${raffle.rafflePrice}원`}</p>
          <p className="font-bold text-blue-700">{`${raffle.raffleNumWinners}명`}</p>
        </div>
      </div>
    </div>
  );
};

export default RaffleCard;