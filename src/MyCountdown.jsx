
import Countdown from 'react-countdown';

  const Completionist = () => <span>You are good to go!</span>;

   const pad = (num) => {
      return String(num).padStart(2, '0');
    }

    const renderer = ({ days, hours, minutes, seconds, completed }) => {

      if (completed) return <Completionist />;

    const units = [
    { label: 'Days', value: days },
    { label: 'Hour', value: hours },
    { label: 'Min', value: minutes },
    { label: 'Sec', value: seconds },
  ];

        return (

             <div className="countdown-row d-flex gap-2 " >
            {units.map((u)=>(
                <div className="countdown-box" key={u.label}>
                    <span className="countdown-value">{pad(u.value)}</span>
                    <span className="countdown-label">{u.label}</span>
                </div>
             ))}

        </div>
        )

    };

const MyCountdown = () => {
  return (
    <>
    <div className="count-card py-3">
        <div className="count-title"> Deals and offers</div>
        <div className="count-subtitle"> Hygiene equipments </div>

     <Countdown
        date={Date.now() + (4 * 86400 + 13 * 3600 + 34 * 60 + 56) * 1000}
        renderer={renderer}
      />
    </div>

    </>
  )
}

export default MyCountdown