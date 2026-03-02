async function runTest() {
    console.log("Submitting login for student 1");
    let res = await fetch("http://localhost:8081/api/v1/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "ogrenci1@loseven.com", password: "123456" })
    });
    let data = await res.json();
    let student1Token = data.token;

    console.log("Student 1 Creating Activity");
    res = await fetch("http://localhost:8081/api/v1/activities", {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${student1Token}` },
        body: JSON.stringify({ title: "Test Ac", description: "Test Desc", hours: 3, eventDate: "2026-05-01T10:00" })
    });
    let activity = await res.json();
    console.log("Created Activity ID:", activity.id);

    console.log("Submitting login for teacher 1");
    res = await fetch("http://localhost:8081/api/v1/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "ogretmen1@loseven.com", password: "123456" })
    });
    data = await res.json();
    let teacher1Token = data.token;

    console.log("Teacher 1 Fetching Pending");
    res = await fetch("http://localhost:8081/api/v1/activities/pending", {
        headers: { "Authorization": `Bearer ${teacher1Token}` }
    });
    let pending = await res.json();
    console.log("Pending activities count for Teacher 1:", pending.length);

    console.log("Teacher 1 Approving Activity");
    res = await fetch(`http://localhost:8081/api/v1/activities/${activity.id}/approve`, {
        method: "POST", headers: { "Authorization": `Bearer ${teacher1Token}` }
    });
    let approved = await res.json();
    console.log("Approved Activity status:", approved.status);
}
runTest().catch(console.error);
