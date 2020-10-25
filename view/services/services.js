const processResponse = response => {
  const status = response.status;
  if (status === 401) {
    return Promise.all([status, response.json()]).then(res => ({
      status: res[0],
      dataBody: res[1],
    }));
  } else {
    try {
      return Promise.all([status, response.json()])
        .then(res => {
         /*  console.info(
            'ResponseStatus',
            JSON.stringify(res[0]),
            'ResponseData',
            JSON.stringify(res[1]),
          ); */
          return {status: res[0], dataBody: res[1]};
        })
        .catch(res => ({
          status: status,
          dataBody: 'OK',
        }));
    } catch (error) {
      return Promise.all([status, {}]).then(res => ({
        status: res[0],
        dataBody: res[1],
      }));
    }
  }
};

function serviceMethod(data, _timeOut = '15000') {
  // eslint-disable-next-line no-undef
  const controller = new AbortController();
  let config = {};
  if (data.method === 'GET' || data.method === 'HEAD') {
    config = {
      signal: controller.signal,
      method: data.method,
      headers: {
        ...data.headers,
        ...{},
      },
    };
  } else {
    config = {
      signal: controller.signal,
      method: data.method,
      headers: {
        ...data.headers,
        ...{},
      },
      body: JSON.stringify(data.body) || {},
    };
  }

  const timeOut = setTimeout(() => {
    controller.abort();
    // eslint-disable-next-line radix
  }, parseInt(_timeOut));
  return fetch(data.url, config)
    .then(response => {
      clearTimeout(timeOut);
      return processResponse(response);
    })
    .catch(() => {
      clearTimeout(timeOut);
      return processResponse({});
    });
}

export {serviceMethod};
