function fetch_list() {
  let result = fetch(
    "https://app.beerawardsplatform.com/api/listScoresheetViewKeys",
    {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type": "application/json;charset=utf-8",
        "Sec-GPC": "1",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        authorization:
          "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjkwNGIwZjkxYmU2ZWIwODY3ZGFiYmFhYjU4N2RmYzJlMzNmMDBhMjQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTmV3IFlvcmsgU3RhdGUgQnJld2VycyBBc3NvY2lhdGlvbiIsInBpY3R1cmUiOiJodHRwczovL2ZpcmViYXNlc3RvcmFnZS5nb29nbGVhcGlzLmNvbS92MC9iL2JlZXItYXdhcmRzLXBsYXRmb3JtLmFwcHNwb3QuY29tL28vdXNlcl9hdmF0YXJzJTJGanJuWm9MWWc5QWhLWFp0cTVDZEZzZ3l5YUpiMi5qcGc_YWx0PW1lZGlhJnRva2VuPTA5MGQ2OTJkLTliMzMtNDEzZS1hNWNkLTg2MjIxZTNhYjc3YiIsImNvbXBldGl0aW9ucyI6eyJBVnRQWXZNTVdEdEpwZVp6MHBEdyI6WyJhZG1pbiIsInNjYW5uZXIiLCJjZWxsYXItbWFzdGVyIiwib3JnYW5pemVyIl0sIlRRalBRaXdVdEJGTTlrR1VTekc2IjpbImNlbGxhci1tYXN0ZXIiXSwiVTJ3ODhIcTd1cHhpOWhSRmhjMFoiOlsiYWRtaW4iLCJvcmdhbml6ZXIiLCJjZWxsYXItbWFzdGVyIiwic2Nhbm5lciJdLCJiOWc1Wmw4SkJhdVhtMmhhY3hPViI6WyJhZG1pbiJdLCJnWFlNbEFuY1hLVk5ibGFXbE5LOCI6WyJhZG1pbiJdfSwiZW1haWwiOiJwYXVsQG5ld3lvcmtjcmFmdGJlZXIuY29tIiwicmVmcmVzaFRpbWUiOiIyMDI2LTAyLTI3VDIxOjM5OjI3LjIxNDQ1MVoiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYmVlci1hd2FyZHMtcGxhdGZvcm0iLCJhdWQiOiJiZWVyLWF3YXJkcy1wbGF0Zm9ybSIsImF1dGhfdGltZSI6MTc5Mjg2MDIyNSwidXNlcl9pZCI6ImpyblpvTFlnOUFoS1hadHE1Q2RGc2d5eWFKYjIiLCJzdWIiOiJqcm5ab0xZZzlBaEtYWnRxNUNkRnNneXlhSmIyIiwiaWF0IjoxNzkyODY2ODI2LCJleHAiOjE3OTI4NzA0MjYsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInBhdWxAbmV3eW9ya2NyYWZ0YmVlci5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.jwRkM9_lDEF-9DSiA4QzFRsUFLrAqWdZJXLCOmUb8aocqbnUIYvI9bS9QUUA-2Ggnn1VLeiGrU_1NR0dQQg7CnZrYMizP7pJlUI20ccgaicT9ES2b3WK3SdwjDGLzznXwsCw_TeHtoKHOMD8SZ2n2v3WadyJi9xad8Z184dUS5msPK2_-6X817CrE0VNS0CHBmFJ4JKezpCspdOFKgBSNk8wWCmyBe4cQPaXgQcx6JacwBogUgwFmzBvMfZA4aSItqqZ26uJnKoPBuwL7OybfGXSmrQwbz7yG7V4LUH_2dt2Q8oq_wwbmbs8YVO4pHAIWvgrBdPHQqqGHlUUYK9LEQ",
        "Alt-Used": "app.beerawardsplatform.com",
      },
      referrer:
        "https://app.beerawardsplatform.com/competition/2026-new-york-state-craft-beer-competition/scoresheet-keys/",
      body: '{"competitionId":"AVtPYvMMWDtJpeZz0pDw"}',
      method: "POST",
      mode: "cors",
    },
  );

  return result.then((x) => x.json()).then((x) => Array.from(x.keys));
}

function fetch_details(id) {
  //app.beerawardsplatform.com/competition/2026-new-york-state-craft-beer-competition/scoresheet-keys/

  return fetch(
    "https://beerawardsplatform.com/api/getScoresheetByKey?key=" + id,
    {
      credentials: "omit",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Sec-GPC": "1",
        "Alt-Used": "beerawardsplatform.com",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
      },
      referrer:
        "https://beerawardsplatform.com/scoresheets/029wH1myTY3tgcjMglOp",
      method: "GET",
      mode: "cors",
    },
  ).then((x) => x.json());
}

async function parse(list) {
  for (item of list) {
    console.log(item);
    let d = await fetch_details(item.id);
    data.push(d);
    await new Promise((r) => setTimeout(r, 500));
  }

  return data;
}

var list;
var data;

async function run() {
  list = await fetch_list();

  data = await parse(list);
}

run();
