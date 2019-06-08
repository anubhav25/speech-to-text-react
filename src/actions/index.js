export const baseUri = "http://localhost:4000/";
export const GETDATA = "GETDATA";
export const _GETDATA_SUCCESS = "_GETDATA_SUCCESS";
export const _GETDATA_FAIL = "_GETDATA_FAIL";
export const loading =
  "data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==";
export const thumb =
  "data:image/png;base64,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";