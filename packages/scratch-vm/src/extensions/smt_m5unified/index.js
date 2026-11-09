const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');  //多言語化のために必要

//ブロックに付けるアイコン
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcyIgogICB3aWR0aD0iMTAuOTcxNDI5IgogICBoZWlnaHQ9IjEwLjk3MTQyOSIKICAgdmlld0JveD0iMCAwIDEwLjk3MTQyOSAxMC45NzE0MjkiCiAgIHNvZGlwb2RpOmRvY25hbWU9InRtcC5wbmciCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnM2IiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0ibmFtZWR2aWV3NCIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiMwMDAwMDAiCiAgICAgYm9yZGVyb3BhY2l0eT0iMC4yNSIKICAgICBpbmtzY2FwZTpzaG93cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIiAvPgogIDxnCiAgICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIKICAgICBpbmtzY2FwZTpsYWJlbD0iSW1hZ2UiCiAgICAgaWQ9Imc4Ij4KICAgIDxpbWFnZQogICAgICAgd2lkdGg9IjEwLjk3MTQyOSIKICAgICAgIGhlaWdodD0iMTAuOTcxNDI5IgogICAgICAgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSIKICAgICAgIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ2dBQUFBb0NBWUFBQUNNL3JodEFBQUFCR2RCVFVFQUFMR1BDL3hoQlFBQUFDQmpTRkpOCkFBQjZKZ0FBZ0lRQUFQb0FBQUNBNkFBQWRUQUFBT3BnQUFBNm1BQUFGM0NjdWxFOEFBQUFCbUpMUjBRQS93RC9BUCtndmFlVEFBQUEKQ1hCSVdYTUFBRFhVQUFBMTFBRmVaZVVJQUFBQUIzUkpUVVVINlFzWUNCNEV3dDBFOVFBQUJsNUpSRUZVV01QTm1OMXZHMWtaaDU4egpjMlk4NDg4NGFScm5veHV4RGUxV3FHeXJSZHh3d1FxaDFhNFFJTFJ3elo4Ri93R0NLeERsQW9UVWl3WFJGUmR0VWJjczJxcVVKdHMwCjNqaUo3Y1R4Zkp6emNqRmp4NG5qMXYwSTlKV2kyUExNT2M5NTM5LzdNYU5FUkhpRHpmbC9BenpQOVBEVDh4ejV2M2EwVXFBVTJscEwKK3orUGlSNDhoRFRCaW1Dc2tGcUxFWXNWWWIvZjV6Q09qMEdlSmE1U2lzWExsMWk5ZmcxOTBPM3krMS84a3JsN256TmZLSkJZUzJRTQp2VFNsYnd4R0xIMWpTSzA5NXMyekJMVFcwdnJtVlJZV0Y5RkpGUEhWa3lkY1VRNXJRUkU3SVpUcXhQZXpBbFJBYkF5YktFenZNTmVnCk90cGVLVFgxUW1kbEFrUnBpclgyemN4aUVhR2ZHc3liQ21nUmR2dUhSR255WmdJYUVkcFJuOVNZbHdlY2xDU3ZxekVaYXhHUmx3ZFUKT1V6ZkdHSnJoOEJLS1l4WVdsSEVRWnFlQ3B4WW05MGpNa3kyMGV1c3dFR1NrQm96MGtsR1BET2FvYW0xV0FTRlFpdDFMTXNqYS9uRAo1Z1pWeitQOStRYWVrNTMzY2EvSHJ4NC81TnJNTEI4MmxvZnI3Y1V4OXp0N1BOanZrb3F3V2l4eHBWcWpFWVE0U2lINVBobWtJQ0xqCmdKbG5vSnNtUE5qdjhHQy9TemROQ0IyWDFWS1pyMWVxblBNTHVFcVJpdVYrcDAxa0RWZXJkUmJERUNQQ0Y5ME9uM1hhbkEvQzRZRmIKY2NSdnYxem5iNjBtKzJtS0FnTFg1ZTFTaFk4V2wzbTNWa2M3NHdFZEF5UmY3TWJtT3ArMnR1bms3YzhCQWxlelZxN3cvWVZGcnMvTQo0anNPZGQvbjl1NE9mMjAxV1MyV2lLM2xYbWNQZ0lyMlVHU2l2OVhhNXBQdExRNXlPQVgwak9GZWU1ZDJFcU5YRlZkcmRkd1RkWGdNCjBJamxMNjBtTjV0UE9UUm1HQjRMN0tjSmQvWjI2S1lKVmMvRENyU1RtSjVKK2QyVGRWeWxFSUZVTW4wOTNPOXlxN1ZOSXdqNCsrNDIKdlJ3T3BUTDk1YnBiN3gzd3g2ZFBXQTZMekJlQ3lZQUs2Q1FwdDNkYlE3aUI1b1pKSU1KR3I4ZXYxeCt4RzhkczlRK3hJa1RHakVYaQpibnVYaHdmN0xJWWhHNzJEVEQ0RGpROGdWYWE2VHBvY2M4aEVENmFTRFFXdVVobVVDSkl2SXZreDRseDdnOHliMUI1RmhFNFMwMG5pClk5ZU01cldyRkpjclZUNXFMSE8rRUl5VnIyT3FGR0RHOC9uWnlpby9YcnJBck84UElZY0pwTEtObndkMzhqY1JnYndLcUR3U2c4OVcKTXAyZVptTWU5QnlIZHlvMXR2cDlVaXVEblk3SmdDa0hpbEZJR1Qza3lPOVdoTTg3ZTNTVG1CblA1MHExTnRtREEvdXNzOGVOelEzYQpTWHdFOVlwMkREVDNKaUpadlFPMjQ0aG0xSDkyaUFlMjFlL3pWZFFmZWsveWhWKzFpY25BKzRNMUIvK0JzdGJNK3Y2WU04WUFGYkFVCkZwbjFDMFA5RGZYeWlwQ0Q5ampvRW9QSjNIY2MzcXVmWTdWWUhydm4xRmEzVnE3d2c4VVYvdlQwUzVwUmZ5aGdtNGZsUlRSNGJHMFIKQWxjejUvdjByVUVFNWdvRjNwMnA4OTM1Qm1YUEczUEFxWjBrY0YzZW4xL2dhNlV5OXp0N3RPS0l4RnJ1dGZlT1F2OFNjT1FsNVNmTApiK1hKSWxROW4vbENBZDl4VDcxUFQxcXc0THBjcWxTNVdDNWpCQ0pqK00zNkkvN2MzTVRtSVg5Uks3bWFiOCtlNDUxSzlhak84dXpuCkc2MlVRanN1em9RTlhlV2dGYmpBUWhEaU93NTlZNmFxZzhQTmM2MWRybFM1UGpPTG94U1c2Y3hSU2xIeS9iRW1QV3A5WTdpMXM4M2QKOWc3WFptWTVOOUl2QjBWNzBoOGlGQnlYcFRERVZZcHVQbnhNYTQ1Q29kVGt1VldSMWFoL3RIZTVQalBIOTg0M1dBcERMbFdxQk81awp6eXNVdnVOUTBwcUw1UW8vWDExajFpOXdzL21VYnBwT0RhaEhBakV4UkhYUDUwZExGeWhwelkwbkd6U0NrTGRMRlc0Mm4zS3hYS0diCkpPd2tFWWZHWklPRE5ZU3U1anR6NTFFSzd1N3RVdFF1SHphVytGZTNnNUZwQS95TUpCa05ZVkZyU2xxemNkaWpteVo4cXo3SFB6dHQKMXNvVmZucGhGUVJpYTRmbDZJdjlEcDlzTjNtdlBzZU03OUZMVTVyOVBwZm1heXdFNFF0MUp1MDRpc0R6aHFQMldLaEd4cTA1djhESAp5Mjhod0tPREE3NVJxMUYwc3pNV2N6bGs1YVBDN2QwZHRxSkRHa0hBQjQybGJIMlJvZFpQUGxwTUJOUmFVeStYY1o1enRTQUVya3ZvCmhpVFc4a0Zqa1pLclQxeHpOQkg5Y0dtRmt2WUFxSG4rK01HbjlhQUNLbjZCUU90bjFxUFJoeG50T05RY2Z5aUJrMk9WZGh3dUZFdXYKNWYyTkErQzdMcDZhN2duMFpOMmI5UDFsNFU2WnFCV3VVdmw3UVh1MjcvMm12TWJtenpRQVd2cysrNVV5bjI1djRVeXIzQmMxQWRkUgpCRnFmMm5rQ1Z6TWJobmlPa3dFaW5GdFpwbGlmUVltSWJENzhONC91M01IRThaa1JhdGVsV0Fod1RzbEd6M1dwaFVVOHJiTks0RGpvCnhRYkZsWlVNOEF5SVhwdTlrVyszUnUyL0pkNHZhajhHOEVnQUFBQWxkRVZZZEdSaGRHVTZZM0psWVhSbEFESXdNalV0TVRFdE1EVlUKTURZNk5UQTZNamtyTURBNk1EQ0p4c1lMQUFBQUpYUkZXSFJrWVhSbE9tMXZaR2xtZVFBeU1ESTFMVEV4TFRBMVZEQTFPakV6T2pFMQpLekF3T2pBd1Y1QzNid0FBQUFCSlJVNUVya0pnZ2c9PQoiCiAgICAgICBpZD0iaW1hZ2UxMCIgLz4KICA8L2c+Cjwvc3ZnPgo='

//メニューに付けるアイコン
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcyIgogICB3aWR0aD0iMTAuOTcxNDI5IgogICBoZWlnaHQ9IjEwLjk3MTQyOSIKICAgdmlld0JveD0iMCAwIDEwLjk3MTQyOSAxMC45NzE0MjkiCiAgIHNvZGlwb2RpOmRvY25hbWU9InRtcC5wbmciCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnM2IiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0ibmFtZWR2aWV3NCIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiMwMDAwMDAiCiAgICAgYm9yZGVyb3BhY2l0eT0iMC4yNSIKICAgICBpbmtzY2FwZTpzaG93cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIiAvPgogIDxnCiAgICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIKICAgICBpbmtzY2FwZTpsYWJlbD0iSW1hZ2UiCiAgICAgaWQ9Imc4Ij4KICAgIDxpbWFnZQogICAgICAgd2lkdGg9IjEwLjk3MTQyOSIKICAgICAgIGhlaWdodD0iMTAuOTcxNDI5IgogICAgICAgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSIKICAgICAgIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ2dBQUFBb0NBWUFBQUNNL3JodEFBQUFCR2RCVFVFQUFMR1BDL3hoQlFBQUFDQmpTRkpOCkFBQjZKZ0FBZ0lRQUFQb0FBQUNBNkFBQWRUQUFBT3BnQUFBNm1BQUFGM0NjdWxFOEFBQUFCbUpMUjBRQS93RC9BUCtndmFlVEFBQUEKQ1hCSVdYTUFBRFhVQUFBMTFBRmVaZVVJQUFBQUIzUkpUVVVINlFzWUNCNEV3dDBFOVFBQUJsNUpSRUZVV01QTm1OMXZHMWtaaDU4egpjMlk4NDg4NGFScm5veHV4RGUxV3FHeXJSZHh3d1FxaDFhNFFJTFJ3elo4Ri93R0NLeERsQW9UVWl3WFJGUmR0VWJjczJxcVVKdHMwCjNqaUo3Y1R4Zkp6emNqRmp4NG5qMXYwSTlKV2kyUExNT2M5NTM5LzdNYU5FUkhpRHpmbC9BenpQOVBEVDh4ejV2M2EwVXFBVTJscEwKK3orUGlSNDhoRFRCaW1Dc2tGcUxFWXNWWWIvZjV6Q09qMEdlSmE1U2lzWExsMWk5ZmcxOTBPM3krMS84a3JsN256TmZLSkJZUzJRTQp2VFNsYnd4R0xIMWpTSzA5NXMyekJMVFcwdnJtVlJZV0Y5RkpGUEhWa3lkY1VRNXJRUkU3SVpUcXhQZXpBbFJBYkF5YktFenZNTmVnCk90cGVLVFgxUW1kbEFrUnBpclgyemN4aUVhR2ZHc3liQ21nUmR2dUhSR255WmdJYUVkcFJuOVNZbHdlY2xDU3ZxekVaYXhHUmx3ZFUKT1V6ZkdHSnJoOEJLS1l4WVdsSEVRWnFlQ3B4WW05MGpNa3kyMGV1c3dFR1NrQm96MGtsR1BET2FvYW0xV0FTRlFpdDFMTXNqYS9uRAo1Z1pWeitQOStRYWVrNTMzY2EvSHJ4NC81TnJNTEI4MmxvZnI3Y1V4OXp0N1BOanZrb3F3V2l4eHBWcWpFWVE0U2lINVBobWtJQ0xqCmdKbG5vSnNtUE5qdjhHQy9TemROQ0IyWDFWS1pyMWVxblBNTHVFcVJpdVYrcDAxa0RWZXJkUmJERUNQQ0Y5ME9uM1hhbkEvQzRZRmIKY2NSdnYxem5iNjBtKzJtS0FnTFg1ZTFTaFk4V2wzbTNWa2M3NHdFZEF5UmY3TWJtT3ArMnR1bms3YzhCQWxlelZxN3cvWVZGcnMvTQo0anNPZGQvbjl1NE9mMjAxV1MyV2lLM2xYbWNQZ0lyMlVHU2l2OVhhNXBQdExRNXlPQVgwak9GZWU1ZDJFcU5YRlZkcmRkd1RkWGdNCjBJamxMNjBtTjV0UE9UUm1HQjRMN0tjSmQvWjI2S1lKVmMvRENyU1RtSjVKK2QyVGRWeWxFSUZVTW4wOTNPOXlxN1ZOSXdqNCsrNDIKdlJ3T3BUTDk1YnBiN3gzd3g2ZFBXQTZMekJlQ3lZQUs2Q1FwdDNkYlE3aUI1b1pKSU1KR3I4ZXYxeCt4RzhkczlRK3hJa1RHakVYaQpibnVYaHdmN0xJWWhHNzJEVEQ0RGpROGdWYWE2VHBvY2M4aEVENmFTRFFXdVVobVVDSkl2SXZreDRseDdnOHliMUI1RmhFNFMwMG5pClk5ZU01cldyRkpjclZUNXFMSE8rRUl5VnIyT3FGR0RHOC9uWnlpby9YcnJBck84UElZY0pwTEtObndkMzhqY1JnYndLcUR3U2c4OVcKTXAyZVptTWU5QnlIZHlvMXR2cDlVaXVEblk3SmdDa0hpbEZJR1Qza3lPOVdoTTg3ZTNTVG1CblA1MHExTnRtREEvdXNzOGVOelEzYQpTWHdFOVlwMkREVDNKaUpadlFPMjQ0aG0xSDkyaUFlMjFlL3pWZFFmZWsveWhWKzFpY25BKzRNMUIvK0JzdGJNK3Y2WU04WUFGYkFVCkZwbjFDMFA5RGZYeWlwQ0Q5ampvRW9QSjNIY2MzcXVmWTdWWUhydm4xRmEzVnE3d2c4VVYvdlQwUzVwUmZ5aGdtNGZsUlRSNGJHMFIKQWxjejUvdjByVUVFNWdvRjNwMnA4OTM1Qm1YUEczUEFxWjBrY0YzZW4xL2dhNlV5OXp0N3RPS0l4RnJ1dGZlT1F2OFNjT1FsNVNmTApiK1hKSWxROW4vbENBZDl4VDcxUFQxcXc0THBjcWxTNVdDNWpCQ0pqK00zNkkvN2MzTVRtSVg5Uks3bWFiOCtlNDUxSzlhak84dXpuCkc2MlVRanN1em9RTlhlV2dGYmpBUWhEaU93NTlZNmFxZzhQTmM2MWRybFM1UGpPTG94U1c2Y3hSU2xIeS9iRW1QV3A5WTdpMXM4M2QKOWc3WFptWTVOOUl2QjBWNzBoOGlGQnlYcFRERVZZcHVQbnhNYTQ1Q29kVGt1VldSMWFoL3RIZTVQalBIOTg0M1dBcERMbFdxQk81awp6eXNVdnVOUTBwcUw1UW8vWDExajFpOXdzL21VYnBwT0RhaEhBakV4UkhYUDUwZExGeWhwelkwbkd6U0NrTGRMRlc0Mm4zS3hYS0diCkpPd2tFWWZHWklPRE5ZU3U1anR6NTFFSzd1N3RVdFF1SHphVytGZTNnNUZwQS95TUpCa05ZVkZyU2xxemNkaWpteVo4cXo3SFB6dHQKMXNvVmZucGhGUVJpYTRmbDZJdjlEcDlzTjNtdlBzZU03OUZMVTVyOVBwZm1heXdFNFF0MUp1MDRpc0R6aHFQMldLaEd4cTA1djhESAp5Mjhod0tPREE3NVJxMUYwc3pNV2N6bGs1YVBDN2QwZHRxSkRHa0hBQjQybGJIMlJvZFpQUGxwTUJOUmFVeStYY1o1enRTQUVya3ZvCmhpVFc4a0Zqa1pLclQxeHpOQkg5Y0dtRmt2WUFxSG4rK01HbjlhQUNLbjZCUU90bjFxUFJoeG50T05RY2Z5aUJrMk9WZGh3dUZFdXYKNWYyTkErQzdMcDZhN2duMFpOMmI5UDFsNFU2WnFCV3VVdmw3UVh1MjcvMm12TWJtenpRQVd2cysrNVV5bjI1djRVeXIzQmMxQWRkUgpCRnFmMm5rQ1Z6TWJobmlPa3dFaW5GdFpwbGlmUVltSWJENzhONC91M01IRThaa1JhdGVsV0Fod1RzbEd6M1dwaFVVOHJiTks0RGpvCnhRYkZsWlVNOEF5SVhwdTlrVyszUnUyL0pkNHZhajhHOEVnQUFBQWxkRVZZZEdSaGRHVTZZM0psWVhSbEFESXdNalV0TVRFdE1EVlUKTURZNk5UQTZNamtyTURBNk1EQ0p4c1lMQUFBQUpYUkZXSFJrWVhSbE9tMXZaR2xtZVFBeU1ESTFMVEV4TFRBMVZEQTFPakV6T2pFMQpLekF3T2pBd1Y1QzNid0FBQUFCSlJVNUVya0pnZ2c9PQoiCiAgICAgICBpZD0iaW1hZ2UxMCIgLz4KICA8L2c+Cjwvc3ZnPgo='

//メニュー定義
const M5unifiedMenus = {
    //GPIO 出力用
    menuCOLOR: {
	items: [
	    { text: 'BLACK',   value: '[0,0,0]' },
	    { text: 'WHITE',   value: '[255,255,255]' },
	    { text: 'RED',     value: '[255,0,0]' },
	    { text: 'GREEN',   value: '[0,255,0]' },
	    { text: 'BLUE',    value: '[0,0,255]' },
	    { text: 'YELLOW',  value: '[255,255,0]' },
	    { text: 'CYAN',    value: '[0,255,255]' },
	    { text: 'MAGENTA', value: '[255,0,255]' },
	    { text: 'GRAY',    value: '[128,128,128]' },
	    { text: 'SILVER',  value: '[192,192,192]' },
	    { text: 'MAROON',  value: '[128,0,0]' },
	    { text: 'OLIVE',   value: '[128,128,0]' },
	    { text: 'TEAL',    value: '[0,128,128]' },
	    { text: 'NAVY',    value: '[0,0,128]' },
	    { text: 'PURPLE',  value: '[128,0,128]' },
	    { text: 'ORANGE',  value: '[255,165,0]' },
	    { text: 'PINK',    value: '[255,192,203]' },
	    { text: 'BROWN',   value: '[165,42,42]' },
	    { text: 'GOLD',    value: '[255,215,0]' }
	]
    },
    menuFILL: {
	items: [
	    { text: 'OFF', value: 'false'},
	    { text: 'ON',  value: 'true'}
	]
    }
};

function createMenuItems(menuKey) {
    return M5unifiedMenus[menuKey].items.map(item => ({
	text: item.text || formatMessage({ id: item.id, default: item.default }),
	value: item.value
    }));
}

//クラス定義
class M5unified {
    constructor (runtime) {
        this.runtime = runtime;
    }

    //ブロック定義
    getInfo () {
        return {
            id: 'm5unified',
            name: formatMessage({
                id: 'm5unified.name',
                default: 'M5unified'
            }),
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
	    color1: '#CF63CF',
	    color2: '#C94FC9',
	    color3: '#BD42BD',
	    blocks: [
                {
                    opcode: 'clear',
                    text: formatMessage({
                        id: 'm5unified.clear',
                        default: 'clear Display. color: [COLOR]'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        COLOR: { type: ArgumentType.STRING, menu: 'menuCOLOR' },
                    }
                },
                {
                    opcode: 'rect',
                    text: formatMessage({
                        id: 'm5unified.rect',
                        default: 'draw rectangle. position: ([POS1],[POS2]), size: ([SIZE1],[SIZE2]), color: [COLOR], fill: [FILL]'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        POS1:  { type: ArgumentType.NUMBER, defaultValue: 10},
                        POS2:  { type: ArgumentType.NUMBER, defaultValue: 10},
                        SIZE1: { type: ArgumentType.NUMBER, defaultValue: 40},
                        SIZE2: { type: ArgumentType.NUMBER, defaultValue: 40},
                        COLOR: { type: ArgumentType.STRING, menu: 'menuCOLOR' },			
                        FILL:  { type: ArgumentType.STRING, menu: 'menuFILL' }
                    }
                },
                {
                    opcode: 'circle',
                    text: formatMessage({
                        id: 'm5unified.circle',
                        default: 'draw circle. position: ([POS1],[POS2]), radius: [RADIUS], color: [COLOR], fill: [FILL]'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        POS1:  { type: ArgumentType.NUMBER, defaultValue: 10},
                        POS2:  { type: ArgumentType.NUMBER, defaultValue: 10},
                        RADIUS:{ type: ArgumentType.NUMBER, defaultValue: 20},
                        COLOR: { type: ArgumentType.STRING, menu: 'menuCOLOR' },			
                        FILL:  { type: ArgumentType.STRING, menu: 'menuFILL' }
                    }
                },
                {
                    opcode: 'line',
                    text: formatMessage({
                        id: 'm5unified.line',
                        default: 'draw line. pos_from: ([POS1],[POS2]), pos_end: ([POS3],[POS4]), width: [WIDTH], color: [COLOR]'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        POS1:  { type: ArgumentType.NUMBER, defaultValue: 10},
                        POS2:  { type: ArgumentType.NUMBER, defaultValue: 10},
                        POS3:  { type: ArgumentType.NUMBER, defaultValue: 10},
                        POS4:  { type: ArgumentType.NUMBER, defaultValue: 50},
                        WIDTH: { type: ArgumentType.NUMBER, defaultValue: 3},
                        COLOR: { type: ArgumentType.STRING, menu: 'menuCOLOR' }
                    }
                },
		{                    
                    opcode :'text',
                    text: formatMessage({
                        id: 'm5unified.text',
                        default:'draw [TEXT]. pos: ([POS1],[POS2]), pointsize: [SIZE], color: [COLOR], backgroud_color: [COLOR2]'
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        TEXT:  { type: ArgumentType.STRING, defaultValue: "text"},
                        POS1:  { type: ArgumentType.NUMBER, defaultValue: 10},
                        POS2:  { type: ArgumentType.NUMBER, defaultValue: 10},
                        SIZE:  { type: ArgumentType.NUMBER, defaultValue: 12},
                        COLOR: { type: ArgumentType.STRING, menu: 'menuCOLOR' },
                        COLOR2:{ type: ArgumentType.STRING, menu: 'menuCOLOR' }
                    }
                },
	    ],
            //ドロップボックスメニューを使う場合は以下に定義が必要
            menus: {
		menuCOLOR: { acceptReporters: false, items: createMenuItems('menuCOLOR') },
		menuFILL:{ acceptReporters: false, items: createMenuItems('menuFILL') },
            }
        };
    }

    //クリックされた時の挙動. 何も行わない．   
    clear() {}
    rect() {}
    circle() {}
    text() {}
    line() {}
}

module.exports = M5unified

