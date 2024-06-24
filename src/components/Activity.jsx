import React from 'react';

const Activity = ({ activity, setActivityEditing, setModalOpen }) => {
  return (
    <button
      className="p-2 text-left whitespace-normal transition-all bg-white border rounded shadow-sm text-slate-900 hover:shadow-md"
      onClick={() => {
        setActivityEditing(activity);
        setModalOpen(true);
      }}
    >
      <h3 className="text-lg font-bold">{activity.title}</h3>

      {activity.location && <span>{activity.location}</span>}

      {activity.notes && (
        <p className="text-sm text-gray-500">"{activity.notes}"</p>
      )}
    </button>
  );
};

export default Activity;
