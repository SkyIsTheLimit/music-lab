import { HTMLAttributes, createContext, useContext, useState } from 'react';

export interface Grid {
  rows: number;
  columns: number;
}

export interface StageContext {
  ledGrid: Grid;
  power: boolean;
  stageColor: string | string[];
}

export interface StageContextApi {
  setLedGrid(grid: Grid): void;
  setPower(power: boolean): void;
  setStageColor(color: string | string[]): void;
}

export const StageContext = createContext<StageContext & StageContextApi>({
  ledGrid: { rows: 0, columns: 0 } as Grid,
  power: false,
  stageColor: 'bg-green-400' as string | string[],

  setLedGrid() {},
  setPower() {},
  setStageColor() {},
});

export function StageManager({ children }: HTMLAttributes<HTMLElement>) {
  const [ledGrid, setLedGrid] = useState<Grid>({ rows: 0, columns: 0 });
  const [power, setPower] = useState(false);
  const [stageColor, setStageColor] = useState<string | string[]>([]);

  return (
    <StageContext.Provider
      value={{
        ledGrid,
        stageColor,
        power,

        setLedGrid,
        setStageColor,
        setPower,
      }}
    >
      {children}
    </StageContext.Provider>
  );
}

export const useStageManager = () => useContext(StageContext);
