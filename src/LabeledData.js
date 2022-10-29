import './LabeledData.scss';

function LabeledData({ label, value }) {
    return (
        <div className='labeled-data'>
            <div className='label'>{label}</div>
            <div className='data'>{value}</div>
        </div>
    );
}

export default LabeledData;