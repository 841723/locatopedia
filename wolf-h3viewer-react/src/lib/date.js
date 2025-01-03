export function formatDate(date) {
    return `on ${new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",

        hour: "numeric",
        minute: "numeric",
    })}`
}
