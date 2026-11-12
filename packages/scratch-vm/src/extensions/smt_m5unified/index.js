const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');  //多言語化のために必要

//ブロックに付けるアイコン
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcxIgogICB3aWR0aD0iNDAiCiAgIGhlaWdodD0iNDAiCiAgIHZpZXdCb3g9IjAgMCA0MCA0MCIKICAgc29kaXBvZGk6ZG9jbmFtZT0idG1wLnBuZyIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczEiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXcxIgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzAwMDAwMCIKICAgICBib3JkZXJvcGFjaXR5PSIwLjI1IgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiNkMWQxZDEiIC8+CiAgPGcKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlua3NjYXBlOmxhYmVsPSJJbWFnZSIKICAgICBpZD0iZzEiPgogICAgPGltYWdlCiAgICAgICB3aWR0aD0iNDAiCiAgICAgICBoZWlnaHQ9IjQwIgogICAgICAgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSIKICAgICAgIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ2dBQUFBb0NBSUFBQUFEbkM4NkFBQUFJR05JVWswQUFIb21BQUNBaEFBQStnQUFBSURvJiMxMDtBQUIxTUFBQTZtQUFBRHFZQUFBWGNKeTZVVHdBQUFBR1lrdEhSQUQvQVA4QS82QzlwNU1BQUFBSGRFbE5SUWZxQ3dzTktBTVhWa2dYJiMxMDtBQUFOR2tsRVFWUll3MzFZV1pBZDVYWCt6dm4vN3I3cjNGbXVaalFhcmFNRmFTU2gwWVpZYkJBSXN3UURCanZFeURhNGlLdHdKWTd6JiMxMDtrRXJGVDNsSUphbEtLZzkyRmZHVzJNYUdPSVlBTVdBaFJLSUlCR2hCYUVIN0x0Q01OSXZtM3RudjB0My9PWG5vT3l5dVN2NnU2b2QrJiMxMDsrTCt6bis5clVsVjgrcWdxRWFtb09nY2pSQXdZS0VRVkJJQVlxb0JDRVFzTVFLQ1FZQTBSd0RPM0tVaFVtWVNJbEVBS0tDa1JBRkZsJiMxMDtCZFB2QVRkd1ZWVVZVQUtBeGtzVUFqVWdhQXhTWmxJd09YWWlTc0pNZ0FHUzIwUUJCd0JpeVJJU0ZBRXBFVU5ZZ2Y4VEdLcUtHT1NnJiMxMDtGaUNGQVFCMXBNUlduYnFCYXpJMUVYYk55ZWN6cEFyQWlUaUZFaGtpSm0xOEJET1VFZ3lpUmpnQXNmanNvUmtEZ0Joa1loakFXWUFjJiMxMDtBR1ViQzFJWCt5cHY3Uy92ZkM4YW5wNitib2wvdzFLellWbnJndm5ObVpSVkJkU0pDSWhCcEFCclBBTm9DQXlGUXZIL2hWcFVDRTZGJiMxMDtsS3dRTVpHbGk4TlQyOTRjM1AwMkx2YkhDTFRRN05XbnBzUHBTbHVoc0d4eFpzTzZjTVBxOXNXZHpZRUhWUlhFVG1BZEUwR3RRcFhvJiMxMDtVOTZMQ0g3ZmE0SUtORmExNnBTZzdFdHB5bTEvcC9UY3RzckZnYWxpazFtM05IL3ZyYm5sQzFxdmpZNGVPRFA2N3FIOGhiN1I2ZWxLJiMxMDtXeUcxOHJwZzAxcTd2cWU5dXlNYitFblNSRlJJbVltVkZIQktJWWtxS1RCamg2b1NTRWxWbkFxTVJTM0d2bU9qTDI0ZmZmL3dlQkNZJiMxMDtHOWEzTEYxZ2V4YTNXYSt5NC9YeTNIbTVCKzl2c25IMjFNVnI3eDJlZlArWW5yODZVZ3RkWjNQcnVsV3BEYjEyNVlyMnpxS1hNU0dwJiMxMDtVVEZLSUJKRi9Qc2VLeFFnS0VURkdyazZGTDd3eHZETHU2dWw4ZnIxM2RrdEcxdHV2YkYxLzZHQmYzK3RNbTNxSTFkTVJ5Yit6cmVMJiMxMDsxWEoxMGR6ODZ2WHRBOWVpVStkR1BqZ1JIajFSK2ZCcTJjRmZPcWR0N1FwYTI1dnFXVmJzYUNaU0orUUJTazdpcEhHU0pvc1JxM28rJiMxMDtzeE42NTRPcnovNTIrT0JKMTlhY2V2ajI3QU5iNWh3N1YzcjF6Y25JNmVtVHBvSXdIYVMrK1ZDMm8wMisvOVBCWE5HL1lWMzZpUzhXJiMxMDtPOXVhcG1PVVM5T25qNVYybmRDako4THljQW5aN0x4NWhhMTNwZSs5TFFNS0JHeEZpVldoZFpBWFFZMWFhMHk1SFAzcXY2Nytic2ZJJiMxMDtaTm0vY1VONjYwT3pObDFYOEswNWVRbUhUOVhyeGxrYno4dm5Ibis4cVh1ZS85SkxINFdjNmkreDduT1BmQjVvZ1lYTTdzak03VWpkJiMxMDtjcHNPRDlVT0hqZTdEK3FoaytIenI5YTc1d2FybDRpVGlNVFZWQzNJaVFxekIrREFpZkxUL3pHdy96aUtyYngxUy91WDdpM21DeURnJiMxMDs0a2NUZi9mamdmTWZhZDE0cTd2eDU0L052dlJoL1Y5L2MyVm9nbU5yYld3RFEydVhoZC9lMnJGaVdYTVlnOGxaQWdoRVhpaDArZHBrJiMxMDtlYXkyb0podWJ3a2lJcXNneHdKbHozaGprKzdGblVQUGJ4c3ZUWVkzOXpZOWV2K3NtOWEwa01aUjVId3YySFA0eXRGajlWeFRHOFZUJiMxMDtLN3FML1plclQvM3NvMUpzbTdQcHprSW03ZFd1amxYZlBvYm91YUcvL2xQVDJaSnp6anFGWVhWS1IwNk52SHVvM0ZYTWQ4LzJsQXlMJiMxMDsyQWlXQlliNDFMbXhYNzFjMnJGdm9yMlFmL0tScHZ2dVNMVTNweEhHd3FFeUEvaDhiK2ZCallQdm41MkdjZHQzbGY2YmRFTFRpMmJqJiMxMDtzUWZ5RzFjWHlhZmpGOHIvOEpQeEV4ZmtmTjlVWjJ1VGloamZsQ3V5WTllVjUxOFp2emhZeVFkanRjclVOeDVlQ3FobFZZKzRiN0R5JiMxMDtnMThNSFR4ZnYzRmo1ckV2dHE2L0xtZVpYQWdZVVFwWXljV3lhR0hySDMvVGp2MncvK3dWblJSU2FRNzhxVWZ1U3oxNFo2ZVR5REJIJiMxMDtYYmtVbDJIRHRHbURFK1ByNmY2SlozL2J0L09kaVk1czhhNWJPL2NkR2o5NzNsYXJRRVl0U3dRdjZCK2R2SENsNnBuVzNoNVp2YnpnJiMxMDtHWllReEtvS0lnakJNSlhHdzErL1BERFU1MWw0WkZ5dE5sNXNrMDI5OHdFblZKdXErTTg4TnpnMFZPbGRtVmswTndmRGI3NVgrdWx6JiMxMDtJeGN1VkZlc3pQL1pZMjJDM041ajAxVlBGQnBvYkVtOVNOM0NoZmw3YjU5NmZXZjk2V2VtRHg5d0Q5MlQzYlNtbU0reUt1QWNxNE9YJiMxMDtPblp5K04zOWs1ekoxeU92eVE4MzkxTFBrblN4TlRVNUdlOC9PUEhjcnNxUjQ2NjF1ZjdWTDNYYVRPcGZYaGg0NXVXK1VMd0g3NS96JiMxMDs5WWZiRnJSNFI4OU5lRlFURkpUSnhyNFZLNkxVbnRYSC8zRFJ1bVZqcis2UWZhY25EMTJZdkhuMXhEMjM1MjljTmF1UTlWUklORnpjJiMxMDtuZitiNzlMZ3FQZlVzMWVYekEzKzZzbnJjaWt5ak8xNyt2NytSeU1UOWZ6aXVkSFhIdTdxNm16K3B4OWQzTDY3MHRtUi92cUR4UWR1JiMxMDtueDE0RVVDaEE4UVpSMURBaW9XeU1haFdndTF2WEZ1MUt2amU5eGE5dFc5bzU2NW96NUdSQThlbk4xeGZ2ZU9tWUZOUGUzdXIzOVh1JiMxMDt6ZXNvWFBwd2VsOVBjUGNkellVTW9saU04cUxaMlMvY0ZiZG0rYzRiWm8rUDB6OCsxWC80WEhYdDBzeVRYMnRidjdyRk9CYzdzT1hwJiMxMDthaTJLWXlZUUZBUkxxZ3hUSG5mYmR3Mkg3UFV1WGY3dzVzNWJWK3Z1ZzVrM2RsZmVmWDkwNzVGNFpYZnRjK3Y5bTlZMUwrcktMbHlRJiMxMDsvdHZ2TGdsU1VleWlpQXdoWExhNCtKZEwyM3ppMTNZTy91dzNwWUh4OE83TlRkLzZjdWVTT1JrWE9XVktoaUtjUWhOeUFnQVdZQUpxJiMxMDtrWlFuYVd4Q0FXaXNzMXJ4bGJ1TFd6YmhuU09wYlh0SEQ1MHVIenp0dmZSYVpjTnF1WEZkMDRaVnhSeG53SnBDQkNkc0tLeTRuNzk0JiMxMDsrWmx0MHpiRFQyeHQvNk83czgyWmxJdTFRWHNhZE1pb2NqcnRMQk9VTFZnQlo2Qk1tWWx4T0FCc25EaEYyRnl3OTIrZWMrY3RuVWZPJiMxMDtEYjI1Wi9yZ1lmUEc3bXV2dkR2V1BydDgwOHIwelQzWm51VnRzM0xwdnNIcDc3L1E5K2JldUhkeCtvbXRoYy8xRnEwNGNZNk5VWU9QJiMxMDtGM0FVaWpwS3A4VVlWVldyNmdENG5ucEJ2VlRLUkRGOGRoSFZDVUdrYkZ5VU11YW1GUjBibDFQL1NQMzlFM1RnZU9Ya2FkMzIrdVNPJiMxMDtIYldGYzZ0TEZxZlBYNXE0TkZqNzhwYk1FMS9wbU4rZWM1RlRCcWxWeEVMRWFoUUVhS1ZTaTV4alR2Z0lXVklMd1BOakwrTW1LeTUyJiMxMDtsWUE5MXJRQmdXSXdPUVdjTU12Q1dXYmg3ZlB1dnBrR3I5U09uUnZkZDZKMi9FenQxZDNYNW5Yay8rTHh6ais0clMyVHB0alZtVUZFJiMxMDtxZ1pxRWtZS01FQ3FCQ1V2RUdhb3dBSUVLQnN5Z1Q4eDdrdnNrV0VESlNZaUF5VWxpQkdGRVlHS3kxbXpaRkd3dEh2V1BadmpzMWZxJiMxMDt4MCtOTFYvWXRINWxYb1RpbUprdGtVSUpMSUNCTUtCSmtwMm9pcVFDSWFpb1dsQ3NJR3NrN2ZOd0dFVjFneFNnSVpFRkxBZ0VHSmdrJiMxMDtUOHdHQ1FlRnlmaG1UWGRxemFKbUloVVZCN0ZNcEp5UTZxUnJGQW80Rm9LUmlWcWtXazJaSEFCRm5SVkdZUXdGR1krY202clVxekRrJiMxMDt5RmNsb01HdlZVRWdJZ0VMRVlnWklBV3BKUFFRQkxhd1JBQ0ZpbENocXF5a29IcE1vb2dCQjJWTG5Bc1lVRUhBUkZDbzc2RWxhNlFhJiMxMDtsTWVxQUVsU2pDb2dKU2dSR2x5Y09HbEZFSWhtYUd0QytMV1JUNEtCR3BBQUllQ3JlcDcxcHFyalI4K3FUYWY5bEE4Z3lXUUkwY0RYJiMxMDtRaUdPd3ZCYWVSS0FVU0kxQUFNQ2lnZ3hWSkxiRXp6NkRBc25Bc0FLQXNnREdRQWtEUFZVTk1VOE51R2UrbVhmT3grRXhpLzRxVFFBJiMxMDtKbWNoQkFWYnl1VEN1a3lOVG5vQXlBa1NLcW9Fc0RiNFp3UTRhSXFJVk5FWVNFbkdxYUVQQklhaHBDR2NwNER4NndPbDZNZlBYTm54JiMxMDtYanFLK0phVnFUWExpMERFSUF2MVFBNHd6VTJlb2ZTWjgwSG80QWVWMkZsVjVpUnVTWTBsR2ZoWWE4d29BYUtrY0ZXVmtRZ1hOY3FSJiMxMDtzY0haSy9FUGZ0bS85NE9xY3ZyR0ZlWTdXNXZtRkV3Y093T3lDZ0F4Z0tYemkyM04vZit6SjJyS2ZYVG5YVzNkc3pNQnFVSUFWVkVvJiMxMDtFWWpZVDNUR3gvQm81RldoQWhnRlFVVkJaTzIrTTZNLy9QbkE4Yk5SejVMc0Y3YlllMitaMzU0T3hOWEJSc1ZRNkJ5clkrSnBSMC8vJiMxMDtydjgvWHhtcGxMVnJYdXR0NjdGK1RmUGlKWVdXWE95elV6VlFhdWhTRU04SWdCbDVtUFFxaVlMWk9iaTM5by8rOHk5R0w0L2d0bzMyJiMxMDtUeDd0V3J3Z0krTGdTQTFpVXFNZzU0UWFoU28xNGYwZkRPL1lPWHJ3YUR3MEhiVzIrajNkMmRWTHZWWExzZ3U3c3UwdG5tOVZsUlFDJiMxMDsrU1RVU1EwNEpST0w4ZXhrS0MvdEd2cTNGMGFtSitpZXpmbHZQZExlT1N2dFhCSXhtb2tSeUVsTU90UHNGSUZ0dVlManAwdDc5MHdlJiMxMDtPRnpwdXlZSVRHdXJQNy9UTGx1b3ZUM1pudm41cG55UVNSdlRJRWJKT0FUZ2lLSVByOGEvZm1YNHRiZXFqdDJqRDJTMzNqZW5tQXVjJiMxMDthelFlRVNYYmlvZ29scENVQ053b0VEaG1aZUl3c2hmN3gvY2NIdGwveUx2UUY1ZW5Tb0k0bHlrVUM3YXpQZFhWR1hYTXFuZDE1TnJ5JiMxMDs2WlJ2R2FpRzd1VGxpVGZlcnA4K3BYTmE3VGUrMm5UL2x0a3Boa3JEMTBTSE5zVDNqRnJVWkxLb0psT2RWRVZzYk1rbm9GSjNsNjlPJiMxMDtIVDB6Y3VZU1g3aU1nV0d1VnNKS2JUS1NlaEI0MXZPSmZWWnI2endSVDlxMDNyQXk5Y1JESFd0NzhoSXAySDZzdUJzZWYyeUJpNVZZJiMxMDtnSGhtalJnQ29FNlRlUWhtWm9DSUVEdWFtcGJoVW1WZ2FIeHdaR0prSElNbGY2THFsVWFqU0trbForWVc0K3RYbUZ2V3oyM0wyOWpGJiMxMDtEQ0VZTUg5V0FuOEM3SWkwUVlRYTRYZXFRbUtTekFnVWNLUWdZaVpTaElBaDhsU3BGbWtVb1ZhTEJjNEVKaDl3eW1NUk9CVmxJaWdyJiMxMDtNWEVTWFNMNmpBVk9Ja3FXNVNkR3FTak4vTEZRd0ZIalI0OFJUVmgyTXJrYXpoQ2dVRUtzNGdrSXBBUW9pVUlVMW9ENUUvcnpDYnhOJiMxMDticGdaQkk1VUNVek1TTFlTaU5RUVFDU2E5SU5ZaFRDcndzVmdLREVZUUtSa3dVd3hFQkZaRXF0Z2NFVGtRd25KODZuenYxOFJZVFJ4JiMxMDtkbVRnQUFBQUpYUkZXSFJrWVhSbE9tTnlaV0YwWlFBeU1ESTJMVEV4TFRBM1ZERXlPak0yT2pRMkt6QXdPakF3dnlRR29nQUFBQ1YwJiMxMDtSVmgwWkdGMFpUcHRiMlJwWm5rQU1qQXlOaTB4TVMwd04xUXhNam96TmpvME5pc3dNRG93TU01NXZoNEFBQUFvZEVWWWRHUmhkR1U2JiMxMDtkR2x0WlhOMFlXMXdBREl3TWpZdE1URXRNVEZVTVRNNk5EQTZNRE1yTURBNk1EQmltcUI2QUFBQUFFbEZUa1N1UW1DQyYjMTA7IgogICAgICAgaWQ9ImltYWdlMSIgLz4KICA8L2c+Cjwvc3ZnPgo='


//メニューに付けるアイコン
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcxIgogICB3aWR0aD0iNDAiCiAgIGhlaWdodD0iNDAiCiAgIHZpZXdCb3g9IjAgMCA0MCA0MCIKICAgc29kaXBvZGk6ZG9jbmFtZT0idG1wLnBuZyIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczEiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXcxIgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzAwMDAwMCIKICAgICBib3JkZXJvcGFjaXR5PSIwLjI1IgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiNkMWQxZDEiIC8+CiAgPGcKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlua3NjYXBlOmxhYmVsPSJJbWFnZSIKICAgICBpZD0iZzEiPgogICAgPGltYWdlCiAgICAgICB3aWR0aD0iNDAiCiAgICAgICBoZWlnaHQ9IjQwIgogICAgICAgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSIKICAgICAgIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ2dBQUFBb0NBSUFBQUFEbkM4NkFBQUFJR05JVWswQUFIb21BQUNBaEFBQStnQUFBSURvJiMxMDtBQUIxTUFBQTZtQUFBRHFZQUFBWGNKeTZVVHdBQUFBR1lrdEhSQUQvQVA4QS82QzlwNU1BQUFBSGRFbE5SUWZxQ3dzTktBTVhWa2dYJiMxMDtBQUFOR2tsRVFWUll3MzFZV1pBZDVYWCt6dm4vN3I3cjNGbXVaalFhcmFNRmFTU2gwWVpZYkJBSXN3UURCanZFeURhNGlLdHdKWTd6JiMxMDtrRXJGVDNsSUphbEtLZzkyRmZHVzJNYUdPSVlBTVdBaFJLSUlCR2hCYUVIN0x0Q01OSXZtM3RudjB0My9PWG5vT3l5dVN2NnU2b2QrJiMxMDsrTCt6bis5clVsVjgrcWdxRWFtb09nY2pSQXdZS0VRVkJJQVlxb0JDRVFzTVFLQ1FZQTBSd0RPM0tVaFVtWVNJbEVBS0tDa1JBRkZsJiMxMDtCZFB2QVRkd1ZWVVZVQUtBeGtzVUFqVWdhQXhTWmxJd09YWWlTc0pNZ0FHUzIwUUJCd0JpeVJJU0ZBRXBFVU5ZZ2Y4VEdLcUtHT1NnJiMxMDtGaUNGQVFCMXBNUlduYnFCYXpJMUVYYk55ZWN6cEFyQWlUaUZFaGtpSm0xOEJET1VFZ3lpUmpnQXNmanNvUmtEZ0Joa1loakFXWUFjJiMxMDtBR1ViQzFJWCt5cHY3Uy92ZkM4YW5wNitib2wvdzFLellWbnJndm5ObVpSVkJkU0pDSWhCcEFCclBBTm9DQXlGUXZIL2hWcFVDRTZGJiMxMDtsS3dRTVpHbGk4TlQyOTRjM1AwMkx2YkhDTFRRN05XbnBzUHBTbHVoc0d4eFpzTzZjTVBxOXNXZHpZRUhWUlhFVG1BZEUwR3RRcFhvJiMxMDtVOTZMQ0g3ZmE0SUtORmExNnBTZzdFdHB5bTEvcC9UY3RzckZnYWxpazFtM05IL3ZyYm5sQzFxdmpZNGVPRFA2N3FIOGhiN1I2ZWxLJiMxMDtXeUcxOHJwZzAxcTd2cWU5dXlNYitFblNSRlJJbVltVkZIQktJWWtxS1RCamg2b1NTRWxWbkFxTVJTM0d2bU9qTDI0ZmZmL3dlQkNZJiMxMDtHOWEzTEYxZ2V4YTNXYSt5NC9YeTNIbTVCKzl2c25IMjFNVnI3eDJlZlArWW5yODZVZ3RkWjNQcnVsV3BEYjEyNVlyMnpxS1hNU0dwJiMxMDtVVEZLSUJKRi9Qc2VLeFFnS0VURkdyazZGTDd3eHZETHU2dWw4ZnIxM2RrdEcxdHV2YkYxLzZHQmYzK3RNbTNxSTFkTVJ5Yit6cmVMJiMxMDsxWEoxMGR6ODZ2WHRBOWVpVStkR1BqZ1JIajFSK2ZCcTJjRmZPcWR0N1FwYTI1dnFXVmJzYUNaU0orUUJTazdpcEhHU0pvc1JxM28rJiMxMDtzeE42NTRPcnovNTIrT0JKMTlhY2V2ajI3QU5iNWh3N1YzcjF6Y25JNmVtVHBvSXdIYVMrK1ZDMm8wMisvOVBCWE5HL1lWMzZpUzhXJiMxMDtPOXVhcG1PVVM5T25qNVYybmRDako4THljQW5aN0x4NWhhMTNwZSs5TFFNS0JHeEZpVldoZFpBWFFZMWFhMHk1SFAzcXY2Nytic2ZJJiMxMDtaTm0vY1VONjYwT3pObDFYOEswNWVRbUhUOVhyeGxrYno4dm5Ibis4cVh1ZS85SkxINFdjNmkreDduT1BmQjVvZ1lYTTdzak03VWpkJiMxMDtjcHNPRDlVT0hqZTdEK3FoaytIenI5YTc1d2FybDRpVGlNVFZWQzNJaVFxekIrREFpZkxUL3pHdy96aUtyYngxUy91WDdpM21DeURnJiMxMDs0a2NUZi9mamdmTWZhZDE0cTd2eDU0L052dlJoL1Y5L2MyVm9nbU5yYld3RFEydVhoZC9lMnJGaVdYTVlnOGxaQWdoRVhpaDArZHBrJiMxMDtlYXkyb0podWJ3a2lJcXNneHdKbHozaGprKzdGblVQUGJ4c3ZUWVkzOXpZOWV2K3NtOWEwa01aUjVId3YySFA0eXRGajlWeFRHOFZUJiMxMDtLN3FML1plclQvM3NvMUpzbTdQcHprSW03ZFd1amxYZlBvYm91YUcvL2xQVDJaSnp6anFGWVhWS1IwNk52SHVvM0ZYTWQ4LzJsQXlMJiMxMDsyQWlXQlliNDFMbXhYNzFjMnJGdm9yMlFmL0tScHZ2dVNMVTNweEhHd3FFeUEvaDhiK2ZCallQdm41MkdjZHQzbGY2YmRFTFRpMmJqJiMxMDtzUWZ5RzFjWHlhZmpGOHIvOEpQeEV4ZmtmTjlVWjJ1VGloamZsQ3V5WTllVjUxOFp2emhZeVFkanRjclVOeDVlQ3FobFZZKzRiN0R5JiMxMDtnMThNSFR4ZnYzRmo1ckV2dHE2L0xtZVpYQWdZVVFwWXljV3lhR0hySDMvVGp2MncvK3dWblJSU2FRNzhxVWZ1U3oxNFo2ZVR5REJIJiMxMDtYYmtVbDJIRHRHbURFK1ByNmY2SlozL2J0L09kaVk1czhhNWJPL2NkR2o5NzNsYXJRRVl0U3dRdjZCK2R2SENsNnBuVzNoNVp2YnpnJiMxMDtHWllReEtvS0lnakJNSlhHdzErL1BERFU1MWw0WkZ5dE5sNXNrMDI5OHdFblZKdXErTTg4TnpnMFZPbGRtVmswTndmRGI3NVgrdWx6JiMxMDtJeGN1VkZlc3pQL1pZMjJDM041ajAxVlBGQnBvYkVtOVNOM0NoZmw3YjU5NmZXZjk2V2VtRHg5d0Q5MlQzYlNtbU0reUt1QWNxNE9YJiMxMDtPblp5K04zOWs1ekoxeU92eVE4MzkxTFBrblN4TlRVNUdlOC9PUEhjcnNxUjQ2NjF1ZjdWTDNYYVRPcGZYaGg0NXVXK1VMd0g3NS96JiMxMDs5WWZiRnJSNFI4OU5lRlFURkpUSnhyNFZLNkxVbnRYSC8zRFJ1bVZqcis2UWZhY25EMTJZdkhuMXhEMjM1MjljTmF1UTlWUklORnpjJiMxMDtuZitiNzlMZ3FQZlVzMWVYekEzKzZzbnJjaWt5ak8xNyt2NytSeU1UOWZ6aXVkSFhIdTdxNm16K3B4OWQzTDY3MHRtUi92cUR4UWR1JiMxMDtueDE0RVVDaEE4UVpSMURBaW9XeU1haFdndTF2WEZ1MUt2amU5eGE5dFc5bzU2NW96NUdSQThlbk4xeGZ2ZU9tWUZOUGUzdXIzOVh1JiMxMDt6ZXNvWFBwd2VsOVBjUGNkellVTW9saU04cUxaMlMvY0ZiZG0rYzRiWm8rUDB6OCsxWC80WEhYdDBzeVRYMnRidjdyRk9CYzdzT1hwJiMxMDthaTJLWXlZUUZBUkxxZ3hUSG5mYmR3Mkg3UFV1WGY3dzVzNWJWK3Z1ZzVrM2RsZmVmWDkwNzVGNFpYZnRjK3Y5bTlZMUwrcktMbHlRJiMxMDsvdHZ2TGdsU1VleWlpQXdoWExhNCtKZEwyM3ppMTNZTy91dzNwWUh4OE83TlRkLzZjdWVTT1JrWE9XVktoaUtjUWhOeUFnQVdZQUpxJiMxMDtrWlFuYVd4Q0FXaXNzMXJ4bGJ1TFd6YmhuU09wYlh0SEQ1MHVIenp0dmZSYVpjTnF1WEZkMDRaVnhSeG53SnBDQkNkc0tLeTRuNzk0JiMxMDsrWmx0MHpiRFQyeHQvNk83czgyWmxJdTFRWHNhZE1pb2NqcnRMQk9VTFZnQlo2Qk1tWWx4T0FCc25EaEYyRnl3OTIrZWMrY3RuVWZPJiMxMDtEYjI1Wi9yZ1lmUEc3bXV2dkR2V1BydDgwOHIwelQzWm51VnRzM0xwdnNIcDc3L1E5K2JldUhkeCtvbXRoYy8xRnEwNGNZNk5VWU9QJiMxMDtGM0FVaWpwS3A4VVlWVldyNmdENG5ucEJ2VlRLUkRGOGRoSFZDVUdrYkZ5VU11YW1GUjBibDFQL1NQMzlFM1RnZU9Ya2FkMzIrdVNPJiMxMDtIYldGYzZ0TEZxZlBYNXE0TkZqNzhwYk1FMS9wbU4rZWM1RlRCcWxWeEVMRWFoUUVhS1ZTaTV4alR2Z0lXVklMd1BOakwrTW1LeTUyJiMxMDtsWUE5MXJRQmdXSXdPUVdjTU12Q1dXYmg3ZlB1dnBrR3I5U09uUnZkZDZKMi9FenQxZDNYNW5Yay8rTHh6ais0clMyVHB0alZtVUZFJiMxMDtxZ1pxRWtZS01FQ3FCQ1V2RUdhb3dBSUVLQnN5Z1Q4eDdrdnNrV0VESlNZaUF5VWxpQkdGRVlHS3kxbXpaRkd3dEh2V1BadmpzMWZxJiMxMDt4MCtOTFYvWXRINWxYb1RpbUprdGtVSUpMSUNCTUtCSmtwMm9pcVFDSWFpb1dsQ3NJR3NrN2ZOd0dFVjFneFNnSVpFRkxBZ0VHSmdrJiMxMDtUOHdHQ1FlRnlmaG1UWGRxemFKbUloVVZCN0ZNcEp5UTZxUnJGQW80Rm9LUmlWcWtXazJaSEFCRm5SVkdZUXdGR1krY202clVxekRrJiMxMDt5RmNsb01HdlZVRWdJZ0VMRVlnWklBV3BKUFFRQkxhd1JBQ0ZpbENocXF5a29IcE1vb2dCQjJWTG5Bc1lVRUhBUkZDbzc2RWxhNlFhJiMxMDtsTWVxQUVsU2pDb2dKU2dSR2x5Y09HbEZFSWhtYUd0QytMV1JUNEtCR3BBQUllQ3JlcDcxcHFyalI4K3FUYWY5bEE4Z3lXUUkwY0RYJiMxMDtRaUdPd3ZCYWVSS0FVU0kxQUFNQ2lnZ3hWSkxiRXp6NkRBc25Bc0FLQXNnREdRQWtEUFZVTk1VOE51R2UrbVhmT3grRXhpLzRxVFFBJiMxMDtKbWNoQkFWYnl1VEN1a3lOVG5vQXlBa1NLcW9Fc0RiNFp3UTRhSXFJVk5FWVNFbkdxYUVQQklhaHBDR2NwNER4NndPbDZNZlBYTm54JiMxMDtYanFLK0phVnFUWExpMERFSUF2MVFBNHd6VTJlb2ZTWjgwSG80QWVWMkZsVjVpUnVTWTBsR2ZoWWE4d29BYUtrY0ZXVmtRZ1hOY3FSJiMxMDtzY0haSy9FUGZ0bS85NE9xY3ZyR0ZlWTdXNXZtRkV3Y093T3lDZ0F4Z0tYemkyM04vZit6SjJyS2ZYVG5YVzNkc3pNQnFVSUFWVkVvJiMxMDtFWWpZVDNUR3gvQm81RldoQWhnRlFVVkJaTzIrTTZNLy9QbkE4Yk5SejVMc0Y3YlllMitaMzU0T3hOWEJSc1ZRNkJ5clkrSnBSMC8vJiMxMDtydjgvWHhtcGxMVnJYdXR0NjdGK1RmUGlKWVdXWE95elV6VlFhdWhTRU04SWdCbDVtUFFxaVlMWk9iaTM5by8rOHk5R0w0L2d0bzMyJiMxMDtUeDd0V3J3Z0krTGdTQTFpVXFNZzU0UWFoU28xNGYwZkRPL1lPWHJ3YUR3MEhiVzIrajNkMmRWTHZWWExzZ3U3c3UwdG5tOVZsUlFDJiMxMDsrU1RVU1EwNEpST0w4ZXhrS0MvdEd2cTNGMGFtSitpZXpmbHZQZExlT1N2dFhCSXhtb2tSeUVsTU90UHNGSUZ0dVlManAwdDc5MHdlJiMxMDtPRnpwdXlZSVRHdXJQNy9UTGx1b3ZUM1pudm41cG55UVNSdlRJRWJKT0FUZ2lLSVByOGEvZm1YNHRiZXFqdDJqRDJTMzNqZW5tQXVjJiMxMDthelFlRVNYYmlvZ29scENVQ053b0VEaG1aZUl3c2hmN3gvY2NIdGwveUx2UUY1ZW5Tb0k0bHlrVUM3YXpQZFhWR1hYTXFuZDE1TnJ5JiMxMDs2WlJ2R2FpRzd1VGxpVGZlcnA4K3BYTmE3VGUrMm5UL2x0a3Boa3JEMTBTSE5zVDNqRnJVWkxLb0psT2RWRVZzYk1rbm9GSjNsNjlPJiMxMDtIVDB6Y3VZU1g3aU1nV0d1VnNKS2JUS1NlaEI0MXZPSmZWWnI2endSVDlxMDNyQXk5Y1JESFd0NzhoSXAySDZzdUJzZWYyeUJpNVZZJiMxMDtnSGhtalJnQ29FNlRlUWhtWm9DSUVEdWFtcGJoVW1WZ2FIeHdaR0prSElNbGY2THFsVWFqU0trbForWVc0K3RYbUZ2V3oyM0wyOWpGJiMxMDtEQ0VZTUg5V0FuOEM3SWkwUVlRYTRYZXFRbUtTekFnVWNLUWdZaVpTaElBaDhsU3BGbWtVb1ZhTEJjNEVKaDl3eW1NUk9CVmxJaWdyJiMxMDtNWEVTWFNMNmpBVk9Ja3FXNVNkR3FTak4vTEZRd0ZIalI0OFJUVmgyTXJrYXpoQ2dVRUtzNGdrSXBBUW9pVUlVMW9ENUUvcnpDYnhOJiMxMDticGdaQkk1VUNVek1TTFlTaU5RUVFDU2E5SU5ZaFRDcndzVmdLREVZUUtSa3dVd3hFQkZaRXF0Z2NFVGtRd25KODZuenYxOFJZVFJ4JiMxMDtkbVRnQUFBQUpYUkZXSFJrWVhSbE9tTnlaV0YwWlFBeU1ESTJMVEV4TFRBM1ZERXlPak0yT2pRMkt6QXdPakF3dnlRR29nQUFBQ1YwJiMxMDtSVmgwWkdGMFpUcHRiMlJwWm5rQU1qQXlOaTB4TVMwd04xUXhNam96TmpvME5pc3dNRG93TU01NXZoNEFBQUFvZEVWWWRHUmhkR1U2JiMxMDtkR2x0WlhOMFlXMXdBREl3TWpZdE1URXRNVEZVTVRNNk5EQTZNRE1yTURBNk1EQmltcUI2QUFBQUFFbEZUa1N1UW1DQyYjMTA7IgogICAgICAgaWQ9ImltYWdlMSIgLz4KICA8L2c+Cjwvc3ZnPgo='


//メニュー定義
const M5unifiedMenus = {
    menuCOLOR: {
	items: [
	    {id: 'm5unified.menuColor01', default: 'BLACK',   value: '[0,0,0]' },
	    {id: 'm5unified.menuColor02', default: 'WHITE',   value: '[255,255,255]' },
	    {id: 'm5unified.menuColor03', default: 'RED',     value: '[255,0,0]' },
	    {id: 'm5unified.menuColor04', default: 'GREEN',   value: '[0,255,0]' },
	    {id: 'm5unified.menuColor05', default: 'BLUE',    value: '[0,0,255]' },
	    {id: 'm5unified.menuColor06', default: 'YELLOW',  value: '[255,255,0]' },
	    {id: 'm5unified.menuColor07', default: 'CYAN',    value: '[0,255,255]' },
	    {id: 'm5unified.menuColor08', default: 'MAGENTA', value: '[255,0,255]' },
	    {id: 'm5unified.menuColor09', default: 'GRAY',    value: '[128,128,128]' },
	    {id: 'm5unified.menuColor10', default: 'SILVER',  value: '[192,192,192]' },
	    {id: 'm5unified.menuColor11', default: 'MAROON',  value: '[128,0,0]' },
	    {id: 'm5unified.menuColor12', default: 'OLIVE',   value: '[128,128,0]' },
	    {id: 'm5unified.menuColor13', default: 'TEAL',    value: '[0,128,128]' },
	    {id: 'm5unified.menuColor14', default: 'NAVY',    value: '[0,0,128]' },
	    {id: 'm5unified.menuColor15', default: 'PURPLE',  value: '[128,0,128]' },
	    {id: 'm5unified.menuColor16', default: 'ORANGE',  value: '[255,165,0]' },
	    {id: 'm5unified.menuColor17', default: 'PINK',    value: '[255,192,203]' },
	    {id: 'm5unified.menuColor18', default: 'BROWN',   value: '[165,42,42]' },
	    {id: 'm5unified.menuColor19', default:'GOLD',     value: '[255,215,0]' }
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
	    color1: '#6cc04a',
            color2: '#5ca53f',
            color3: '#4d8a35',
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

