import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Глобалы Vitest выключены, поэтому Testing Library не может сама зарегистрировать cleanup.
afterEach(cleanup);
