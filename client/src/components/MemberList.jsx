function MemberList({ members }) {
  if (!members || members.length === 0) {
    return <p className="no-results">No one has joined yet.</p>;
  }

  return (
    <div className="member-list">
      {members.map((member) => (
        <span key={member._id} className="member-pill">{member.userId?.name}</span>
      ))}
    </div>
  );
}

export default MemberList;