import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@goodmanltd/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
