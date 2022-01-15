function solution(participant, completion) {
    const histogram = new Map();

    participant.forEach((name) => {
        const count = (histogram.get(name) || 0) + 1;
        histogram.set(name, count);
    });

    completion.forEach((name) => {
        if (histogram.has(name)) {
            const count = histogram.get(name) - 1;
            histogram.set(name, count);
            if (!count) histogram.delete(name);
        }
    });

    const answer = [...histogram.keys()][0];
    return answer;
}
