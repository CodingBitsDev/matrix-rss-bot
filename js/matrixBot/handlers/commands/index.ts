export interface Command{
  name: string,
  description: string,
  command: string,
  params?: Param[],
  optionalParams?: OptionalParam[],
}

type ParamType = "string" | "number";

export interface Param{
  name: string,
  description: string,
  type: ParamType
}

export interface OptionalParam{
  name: string,
  description: string,
  type: ParamType,
  initator: string //e.q.: -i 
}