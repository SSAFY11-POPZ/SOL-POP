import PropTypes from 'prop-types'
import {useNavigate} from 'react-router-dom'
const RaffleCard = ({raffle}) => {
  const navigate = useNavigate()

  RaffleCard.propTypes = {
  raffle: PropTypes.shape({
    pk: PropTypes.number.isRequired,
    thumbnail: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    participants: PropTypes.number.isRequired,
  }).isRequired,
  };

  return (
    <div className="my-4" onClick={() =>navigate(`/raffle/${raffle.pk}`)}>
        <img
          className="aspect-[1/1] w-full"
          src={raffle.thumbnail}
          alt="raffle thumbnail"
        >
        </img>
        <div className="mx-3 text-2xl font-bold">
          <p className="text-lg text-slate-800 my-1">{raffle.title}</p>
          <div className="flex justify-between my-1">
            <p className="font-bold">{`${raffle.price}원`}</p>
            <p className="font-bold text-blue-700">{`${raffle.participants}명`}</p>
          </div>
        </div>
      </div>
  );
};

export default RaffleCard;