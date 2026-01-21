import clientPromise from '../../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug, format = 'csv' } = req.query;
  
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Get team info
    const team = await db.collection('teams').findOne({ slug });
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    // Get all votes/voters for this team
    const votes = await db.collection('votes').find({ teamSlug: slug }).toArray();

    // Format the data
    const votersData = votes.map((vote, index) => ({
      sNo: index + 1,
      name: vote.name || 'N/A',
      email: vote.userEmail || 'N/A',
      linkedin: vote.linkedin || 'N/A',
      votedAt: vote.createdAt ? new Date(vote.createdAt).toLocaleString() : 'N/A'
    }));

    if (format === 'json') {
      return res.status(200).json({
        teamName: team.name,
        teamSlug: slug,
        totalVoters: votersData.length,
        exportedAt: new Date().toISOString(),
        voters: votersData
      });
    }

    // Generate CSV
    const headers = ['S.No', 'Name', 'Email', 'LinkedIn', 'Voted At'];
    const csvRows = [
      headers.join(','),
      ...votersData.map(voter => [
        voter.sNo,
        `"${(voter.name || '').replace(/"/g, '""')}"`,
        `"${(voter.email || '').replace(/"/g, '""')}"`,
        `"${(voter.linkedin || '').replace(/"/g, '""')}"`,
        `"${(voter.votedAt || '').replace(/"/g, '""')}"`
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const filename = `voters-${slug}-${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csvContent);
    
  } catch (error) {
    console.error('Error downloading voters:', error);
    return res.status(500).json({ error: 'Failed to download voters list' });
  }
}
