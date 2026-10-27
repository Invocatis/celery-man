Bun.serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);

    let file = url.pathname.slice("/print".length);
    console.log(file);

    const proc = Bun.spawn(["lp", "-d", "Xerox-Phaser-6022", "." + file]);

    // const proc = Bun.spawn(["ls", "." + file]);

    await proc.exited;

    return new Response("Done");
  },
});
